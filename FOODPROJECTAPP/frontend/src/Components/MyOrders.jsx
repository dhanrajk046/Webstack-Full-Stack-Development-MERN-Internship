import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/actions/orderActions";

const statusClass = (status) => {
  if (!status) return "processing";
  const s = status.toLowerCase();
  if (s === "delivered") return "delivered";
  if (s === "cancelled") return "cancelled";
  return "processing";
};

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders = [], listLoading, listError } = useSelector(
    (state) => state.orders || {},
  );
  const { isAuthenticated } = useSelector((state) => state.user || {});

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchMyOrders());
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container py-5 text-center">
        <div className="empty-state">
          <div className="mb-3" style={{ fontSize: "3rem" }}>🔒</div>
          <h3>Sign in to view orders</h3>
          <p className="text-muted">Your order history will appear here once you&apos;re logged in.</p>
          <Link to="/users/login" className="btn btn-primary mt-2">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="page-title">My Orders</h1>

      {listLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading orders...</span>
          </div>
        </div>
      ) : listError ? (
        <div className="alert alert-danger rounded-3">{listError}</div>
      ) : orders.length === 0 ? (
        <div className="empty-state py-5">
          <div className="mb-3" style={{ fontSize: "3rem" }}>📦</div>
          <h4>No orders yet</h4>
          <p className="text-muted">When you place an order, it&apos;ll show up here.</p>
          <Link to="/" className="btn btn-primary mt-2">Browse Restaurants</Link>
        </div>
      ) : (
        <div className="orders-table-wrapper">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Restaurant</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <span className="font-monospace text-muted" style={{ fontSize: "0.82rem" }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td>{order.restaurant?.name || "Restaurant"}</td>
                    <td>
                      <span className={`status-badge ${statusClass(order.orderStatus)}`}>
                        {order.orderStatus || "Processing"}
                      </span>
                    </td>
                    <td className="fw-bold">Rs. {order.finalTotal?.toFixed(2)}</td>
                    <td>
                      <Link
                        to={`/orders/${order._id}`}
                        className="btn btn-sm btn-outline-success"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
