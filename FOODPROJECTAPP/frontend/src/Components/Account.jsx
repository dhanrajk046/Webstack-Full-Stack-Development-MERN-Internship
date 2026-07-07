import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/actions/orderActions";
import { logout, updateProfile } from "../redux/actions/userActions";

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.user || {},
  );
  const { orders = [], listLoading, listError } = useSelector(
    (state) => state.orders || {},
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/users/login");
      return;
    }

    dispatch(fetchMyOrders());
  }, [dispatch, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  const changeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(updateProfile(formData));
  };

  const logoutHandler = async () => {
    await dispatch(logout());
    navigate("/");
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">My Account</h1>
          <p className="text-muted mb-0">Manage your customer profile and orders.</p>
        </div>
        <button className="btn btn-outline-danger" onClick={logoutHandler}>
          Logout
        </button>
      </div>

      <div className="row">
        <div className="col-lg-5">
          <form className="bg-white rounded shadow-sm p-4" onSubmit={submitHandler}>
            <h4 className="mb-3">Profile</h4>
            {error && <div className="alert alert-danger">{error}</div>}
            <label className="form-label" htmlFor="account_name">
              Name
            </label>
            <input
              id="account_name"
              name="name"
              className="form-control mb-3"
              value={formData.name}
              onChange={changeHandler}
              required
            />
            <label className="form-label" htmlFor="account_email">
              Email
            </label>
            <input
              id="account_email"
              name="email"
              type="email"
              className="form-control mb-3"
              value={formData.email}
              onChange={changeHandler}
              required
            />
            <label className="form-label" htmlFor="account_phone">
              Phone
            </label>
            <input
              id="account_phone"
              name="phoneNumber"
              className="form-control mb-4"
              pattern="[0-9]{10}"
              value={formData.phoneNumber}
              onChange={changeHandler}
              required
            />
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>

        <div className="col-lg-7 mt-4 mt-lg-0">
          <div className="bg-white rounded shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Recent Orders</h4>
              <Link to="/orders">View all</Link>
            </div>
            {listLoading ? (
              <p>Loading orders...</p>
            ) : listError ? (
              <div className="alert alert-danger">{listError}</div>
            ) : orders.length === 0 ? (
              <p className="text-muted mb-0">No orders yet.</p>
            ) : (
              orders.slice(0, 5).map((order) => (
                <div className="d-flex justify-content-between border-bottom py-3" key={order._id}>
                  <div>
                    <strong>{order.restaurant?.name || "Restaurant"}</strong>
                    <p className="mb-0 text-muted">{order.orderStatus}</p>
                  </div>
                  <div className="text-end">
                    <div>Rs. {order.finalTotal?.toFixed(2)}</div>
                    <Link to={`/orders/${order._id}`}>Details</Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
