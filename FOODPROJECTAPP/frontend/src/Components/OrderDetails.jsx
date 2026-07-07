import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails } from "../redux/actions/orderActions";

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { 
    orderDetails: order, 
    detailsLoading, 
    detailsError 
  } = useSelector((state) => state.orders || {});

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  // FIX: Also check if order is empty, not just undefined
  if (detailsLoading || !order || Object.keys(order).length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
           <span className="visually-hidden">Loading order...</span>
        </div>
      </div>
    );
  }

  if (detailsError) {
    return <div className="container py-5 alert alert-danger">{detailsError}</div>;
  }

  return (
    <div className="container py-4">
      <div className="alert alert-success">
        Order placed successfully. Order ID: <strong>{order._id}</strong>
      </div>
      <div className="row mt-4">
        <div className="col-lg-8">
          <h3 className="mb-4">Items Ordered</h3>
          
          {/* FIX: Added ?.map to prevent crashes if orderItems is undefined */}
          {order.orderItems?.map((item) => (
            <div className="cart-item row align-items-center mb-3 shadow-sm p-2 rounded" key={item.fooditem}>
              <div className="col-4 col-md-2">
                <img src={item.image} alt={item.name} className="img-fluid rounded" />
              </div>
              <div className="col-8 col-md-6">
                <h5 className="mb-1">{item.name}</h5>
                <p className="mb-0 text-muted">Qty: {item.quantity}</p>
              </div>
              <div className="col-12 col-md-4 text-md-end mt-2 mt-md-0 fw-bold">
                Rs. {(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4 mt-4 mt-lg-0">
          <div id="order_summary" className="bg-white p-4 shadow-sm rounded">
            <h4 className="mb-3">Order Placed</h4>
            <p className="mb-1"><strong>Status:</strong> <span className={order.orderStatus === "Delivered" ? "text-success" : "text-info"}>{order.orderStatus}</span></p>
            <p className="mb-1"><strong>Payment:</strong> {order.paymentInfo?.status || "Not available"}</p>
            
            {/* Note: If restaurant name is blank, ensure your backend uses .populate('restaurant', 'name') */}
            {order.restaurant?.name && (
              <p className="mb-3"><strong>Restaurant:</strong> {order.restaurant.name}</p>
            )}
            
            <hr />
            <p className="d-flex justify-content-between mb-1">
              <span>Subtotal</span> <span className="order-summary-values">Rs. {order.itemsPrice?.toFixed(2) || 0}</span>
            </p>
            <p className="d-flex justify-content-between mb-1">
              <span>Tax</span> <span className="order-summary-values">Rs. {order.taxPrice?.toFixed(2) || 0}</span>
            </p>
            <p className="d-flex justify-content-between mb-3">
              <span>Delivery</span> <span className="order-summary-values">Rs. {order.deliveryCharge?.toFixed(2) || 0}</span>
            </p>
            
            <h5 className="d-flex justify-content-between text-primary">
              <span>Total</span> <span className="order-summary-values">Rs. {order.finalTotal?.toFixed(2) || 0}</span>
            </h5>
            
            <hr />
            <h5 className="mb-2">Delivery Address</h5>
            
            {/* FIX: Added ?. to deliveryInfo fields */}
            <p className="mb-1 text-muted">{order.deliveryInfo?.address}</p>
            <p className="mb-1 text-muted">{order.deliveryInfo?.city}, {order.deliveryInfo?.postalCode}</p>
            <p className="mb-3 text-muted">{order.deliveryInfo?.phoneNo}</p>
            
            <Link to="/orders" className="btn btn-primary w-100 mt-2">View My Orders</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;