import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/actions/orderActions";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders = [], listLoading, listError } = useSelector((state) => state.orders || {});
  const { isAuthenticated } = useSelector((state) => state.user || {});

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container py-5 text-center">
        <h2>My Orders</h2>
        <Link to="/users/login" className="btn btn-primary mt-3">Login</Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">My Orders</h1>
      {listLoading ? (
        <p>Loading orders...</p>
      ) : listError ? (
        <div className="alert alert-danger">{listError}</div>
      ) : orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Order</th>
                <th>Restaurant</th>
                <th>Status</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.slice(-8).toUpperCase()}</td>
                  <td>{order.restaurant?.name || "Restaurant"}</td>
                  <td>{order.orderStatus}</td>
                  <td>Rs. {order.finalTotal?.toFixed(2)}</td>
                  <td>
                    <Link to={`/orders/${order._id}`} className="btn btn-sm btn-primary">Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
