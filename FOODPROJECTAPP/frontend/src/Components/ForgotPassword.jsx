import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { forgotPassword } from "../redux/actions/userActions";
import { clearErrors } from "../redux/slices/userSlice";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const { loading, error, message } = useSelector(
    (state) => state.user || {}
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (message) {
      toast.success(message);
    }
  }, [dispatch, error, message]);

  const submitHandler = (event) => {
    event.preventDefault();
    if (!email) {
      toast.warn("Please enter your email address.");
      return;
    }
    dispatch(forgotPassword(email));
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
                Forgot Password
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: 0 }}>
                Enter your email to receive a password reset link
              </p>
            </div>

            {message && (
              <div className="alert alert-success py-2 text-center" role="alert" style={{ fontSize: "0.88rem" }}>
                {message}
              </div>
            )}

            <form onSubmit={submitHandler} noValidate>
              <div className="mb-4">
                <label htmlFor="email_field" className="form-label">
                  Email address
                </label>
                <input
                  id="email_field"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                id="forgot_btn"
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
                    Sending link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <hr className="my-4" />

            <p className="mb-0 text-center" style={{ fontSize: "0.88rem" }}>
              Remember your password?{" "}
              <Link to="/users/login" style={{ fontWeight: 600, color: "var(--brand-green)" }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
