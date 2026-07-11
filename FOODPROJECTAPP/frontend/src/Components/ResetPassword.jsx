import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../redux/actions/userActions";
import { clearErrors } from "../redux/slices/userSlice";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const { loading, error, isAuthenticated, success } = useSelector(
    (state) => state.user || {}
  );

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Password reset successfully. You are now logged in!");
      navigate("/account");
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, isAuthenticated, error, navigate]);

  const submitHandler = (event) => {
    event.preventDefault();

    if (password.length < 6) {
      toast.warn("Password must be at least 6 characters long.");
      return;
    }

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match.");
      return;
    }

    dispatch(resetPassword(token, password, passwordConfirm));
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5 col-xl-4">
          <div className="form-card">
            {/* Brand header */}
            <div className="text-center mb-4">
              <img
                src="/images/logo.webp"
                alt="Food Genie logo"
                style={{ height: "48px", width: "auto", objectFit: "contain", marginBottom: "0.5rem" }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.25rem" }}>
                Reset Password
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: 0 }}>
                Enter your new password below
              </p>
            </div>

            <form onSubmit={submitHandler} noValidate>
              <div className="mb-3">
                <label htmlFor="password_field" className="form-label">
                  New Password
                </label>
                <input
                  id="password_field"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="confirm_password_field" className="form-label">
                  Confirm Password
                </label>
                <input
                  id="confirm_password_field"
                  type="password"
                  className="form-control"
                  value={passwordConfirm}
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                  placeholder="Confirm new password"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                id="reset_btn"
                className="btn btn-primary w-100 py-2"
                disabled={loading}
                style={{ borderRadius: "var(--radius-pill)", fontWeight: 700 }}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
