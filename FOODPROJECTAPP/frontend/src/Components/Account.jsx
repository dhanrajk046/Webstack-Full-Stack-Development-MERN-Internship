import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/actions/orderActions";
import { logout, updateProfile } from "../redux/actions/userActions";
import { updateReset, clearErrors } from "../redux/slices/userSlice";
import { toast } from "react-toastify";

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error, isupdated } = useSelector(
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

  // Handle profile update success or failure feedback
  useEffect(() => {
    if (isupdated) {
      toast.success("Profile updated successfully!");
      dispatch(updateReset());
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, isupdated, error]);

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
          <h1 className="mb-1" style={{ fontWeight: 800 }}>My Account</h1>
          <p className="text-muted mb-0">Manage your customer profile and orders.</p>
        </div>
        <button className="btn btn-outline-danger px-4 rounded-pill" onClick={logoutHandler}>
          Logout
        </button>
      </div>

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-lg-5">
          <form className="bg-white rounded-3 shadow-sm p-4 border" onSubmit={submitHandler}>
            <h4 className="mb-3" style={{ fontWeight: 700 }}>Profile Settings</h4>
            
            <div className="mb-3">
              <label className="form-label fw-600" htmlFor="account_name">
                Name
              </label>
              <input
                id="account_name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={changeHandler}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-600" htmlFor="account_email">
                Email
              </label>
              <input
                id="account_email"
                name="email"
                type="email"
                className="form-control"
                value={formData.email}
                onChange={changeHandler}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-600" htmlFor="account_phone">
                Phone Number
              </label>
              <input
                id="account_phone"
                name="phoneNumber"
                className="form-control"
                pattern="[0-9]{10}"
                title="Enter exactly 10 digits"
                placeholder="e.g. 9876543210"
                value={formData.phoneNumber}
                onChange={changeHandler}
                required
              />
              <div className="form-text small text-muted">Must be a valid 10-digit number.</div>
            </div>

            <button className="btn btn-primary w-100 py-2 rounded-pill fw-700" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </button>
          </form>
        </div>

        {/* Recent Orders */}
        <div className="col-lg-7">
          <div className="bg-white rounded-3 shadow-sm p-4 border h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0" style={{ fontWeight: 700 }}>Recent Orders</h4>
              <Link to="/orders" className="fw-600 text-decoration-none">View all</Link>
            </div>

            {listLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading orders...</span>
                </div>
              </div>
            ) : listError ? (
              <div className="alert alert-danger">{listError}</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <div style={{ fontSize: "2rem" }}>📦</div>
                <p className="mb-0">No orders placed yet.</p>
              </div>
            ) : (
              <div className="recent-orders-list">
                {orders.slice(0, 5).map((order) => (
                  <div className="d-flex justify-content-between align-items-center border-bottom py-3" key={order._id}>
                    <div>
                      <strong className="text-dark">{order.restaurant?.name || "Restaurant"}</strong>
                      <div className="small text-muted font-monospace mt-1">#{order._id.slice(-8).toUpperCase()}</div>
                      <span className={`status-badge mt-1 d-inline-block`} style={{ fontSize: "0.75rem" }}>
                        {order.orderStatus || "Processing"}
                      </span>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-dark">Rs. {order.finalTotal?.toFixed(2)}</div>
                      <Link to={`/orders/${order._id}`} className="btn btn-sm btn-outline-success rounded-pill px-3 mt-2" style={{ fontSize: "0.75rem" }}>
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
