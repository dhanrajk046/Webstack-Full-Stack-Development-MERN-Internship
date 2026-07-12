import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../redux/actions/cartActions";
import { placeOrder } from "../redux/actions/orderActions";
import api from "../utils/api";
import Loader from "./layout/Loader";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems = [], restaurant = {} } = useSelector((state) => state.cart || {});
  const { isAuthenticated, user, authChecked } = useSelector((state) => state.user || {});
  const { loading, error } = useSelector((state) => state.orders || {});
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isPaying, setIsPaying] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    city: "",
    phoneNo: user?.phoneNumber || "",
    postalCode: "",
    country: "India",
  });

  const [prevUser, setPrevUser] = useState(null);
  if (user !== prevUser) {
    setPrevUser(user);
    if (user?.phoneNumber) {
      setDeliveryInfo((current) => ({
        ...current,
        phoneNo: current.phoneNo || user.phoneNumber,
      }));
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);



  const subtotal = cartItems.reduce((total, item) => {
    const foodItem = item.foodItem || item;
    return total + Number(foodItem?.price || 0) * Number(item.quantity || 1);
  }, 0);
  const deliveryCharge = subtotal > 0 ? 40 : 0;
  const taxPrice = Math.round(subtotal * 0.05);
  const finalTotal = subtotal + deliveryCharge + taxPrice;

  const changeHandler = (event) => {
    setDeliveryInfo({ ...deliveryInfo, [event.target.name]: event.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (paymentMethod === "COD") {
      const order = await dispatch(placeOrder(deliveryInfo));
      if (order?._id) {
        navigate(`/orders/${order._id}`);
      }
    } else {
      try {
        setIsPaying(true);
        const { data } = await api.post("/v1/payment/process", {
          items: cartItems,
        });
        if (data?.url) {
          window.location.href = data.url;
        } else {
          setIsPaying(false);
          alert("Stripe redirection failed");
        }
      } catch (err) {
        setIsPaying(false);
        alert(err.response?.data?.message || err.message || "Payment initialization failed");
      }
    }
  };

  if (!authChecked) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-5 text-center">
        <h2>Checkout</h2>
        <p className="text-muted">Please login before placing an order.</p>
        <Link to="/users/login" state={{ from: "/checkout" }} className="btn btn-primary">Login</Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Your cart is empty</h2>
        <Link to="/" className="btn btn-primary mt-3">Browse Restaurants</Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Place Order</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        <div className="col-lg-7">
          <form className="bg-white rounded shadow-sm p-4" onSubmit={submitHandler}>
            <h4 className="mb-3">Delivery Details</h4>
            <input name="address" className="form-control mb-3" placeholder="Address" value={deliveryInfo.address} onChange={changeHandler} required />
            <input name="city" className="form-control mb-3" placeholder="City" value={deliveryInfo.city} onChange={changeHandler} required />
            <input name="phoneNo" className="form-control mb-3" placeholder="Phone number" value={deliveryInfo.phoneNo} onChange={changeHandler} required />
            <input name="postalCode" className="form-control mb-3" placeholder="Postal code" value={deliveryInfo.postalCode} onChange={changeHandler} required />
             <input name="country" className="form-control mb-4" placeholder="Country" value={deliveryInfo.country} onChange={changeHandler} required />
            
            <h4 className="mb-3">Payment Method</h4>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="cod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              <label className="form-check-label ms-2" htmlFor="cod">
                Cash on Delivery (COD)
              </label>
            </div>
            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="online"
                value="Online"
                checked={paymentMethod === "Online"}
                onChange={() => setPaymentMethod("Online")}
              />
              <label className="form-check-label ms-2" htmlFor="online">
                Pay Online (Stripe)
              </label>
            </div>

            <button id="checkout_btn" className="btn btn-primary w-100" disabled={loading || isPaying}>
              {isPaying ? "Redirecting to Stripe..." : loading ? "Placing order..." : paymentMethod === "COD" ? "Place Order (COD)" : "Pay Online"}
            </button>
          </form>
        </div>
        <div className="col-lg-5 mt-4 mt-lg-0">
          <div id="order_summary">
            <h4>Order Details</h4>
            {restaurant?.name && <p>Restaurant: {restaurant.name}</p>}
            <hr />
            {cartItems.map((item) => {
              const foodItem = item.foodItem || item;
              return (
                <p key={foodItem._id}>
                  {foodItem.name} x {item.quantity}
                  <span className="order-summary-values">Rs. {(foodItem.price * item.quantity).toFixed(2)}</span>
                </p>
              );
            })}
            <hr />
            <p>Subtotal <span className="order-summary-values">Rs. {subtotal.toFixed(2)}</span></p>
            <p>Tax <span className="order-summary-values">Rs. {taxPrice.toFixed(2)}</span></p>
            <p>Delivery <span className="order-summary-values">Rs. {deliveryCharge.toFixed(2)}</span></p>
            <h5>Total <span className="order-summary-values">Rs. {finalTotal.toFixed(2)}</span></h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
