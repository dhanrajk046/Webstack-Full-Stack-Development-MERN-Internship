import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../redux/actions/cartActions";
import { placeOrder } from "../redux/actions/orderActions";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems = [], restaurant = {} } = useSelector((state) => state.cart || {});
  const { isAuthenticated, user } = useSelector((state) => state.user || {});
  const { loading, error } = useSelector((state) => state.orders || {});
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    city: "",
    phoneNo: user?.phoneNumber || "",
    postalCode: "",
    country: "India",
  });

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (user?.phoneNumber) {
      setDeliveryInfo((current) => ({
        ...current,
        phoneNo: current.phoneNo || user.phoneNumber,
      }));
    }
  }, [user]);

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
    const order = await dispatch(placeOrder(deliveryInfo));
    if (order?._id) {
      navigate(`/orders/${order._id}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-5 text-center">
        <h2>Checkout</h2>
        <p className="text-muted">Please login before placing an order.</p>
        <Link to="/users/login" className="btn btn-primary">Login</Link>
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
            <button id="checkout_btn" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Placing order..." : "Place Order"}
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
