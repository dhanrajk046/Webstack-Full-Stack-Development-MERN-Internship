import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../redux/actions/userActions";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.user || {},
  );
  const [clientError, setClientError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    passwordConfirm: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/account");
    }
  }, [isAuthenticated, navigate]);

  const changeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setClientError("");

    if (formData.password !== formData.passwordConfirm) {
      setClientError("Passwords must match.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phoneNumber.trim())) {
      setClientError("Please enter a valid 10 digit phone number.");
      return;
    }

    const user = await dispatch(register(formData));
    if (user) {
      navigate("/account");
    }
  };

  const passwordMismatch =
    formData.passwordConfirm && formData.password !== formData.passwordConfirm;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6 col-xl-5">
          <div className="form-card">
            {/* Brand header */}
            <div className="text-center mb-4">
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🧞</div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.25rem" }}>Create your account</h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: 0 }}>Join Food Genie and start ordering</p>
            </div>

            {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
            {clientError && <div className="alert alert-warning py-2" role="alert">{clientError}</div>}
            {passwordMismatch && (
              <div className="alert alert-warning py-2" role="alert">Passwords must match.</div>
            )}

            <form onSubmit={submitHandler} noValidate>
              <div className="mb-3">
                <label htmlFor="name_field" className="form-label">Full name</label>
                <input
                  id="name_field"
                  name="name"
                  className="form-control"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={changeHandler}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email_reg_field" className="form-label">Email address</label>
                <input
                  id="email_reg_field"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={changeHandler}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="phone_field" className="form-label">Phone number</label>
                <input
                  id="phone_field"
                  name="phoneNumber"
                  className="form-control"
                  placeholder="10 digit mobile number"
                  pattern="[0-9]{10}"
                  value={formData.phoneNumber}
                  onChange={changeHandler}
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password_reg_field" className="form-label">Password</label>
                <input
                  id="password_reg_field"
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Min. 6 characters"
                  minLength="6"
                  value={formData.password}
                  onChange={changeHandler}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="confirm_password_field" className="form-label">Confirm password</label>
                <input
                  id="confirm_password_field"
                  name="passwordConfirm"
                  type="password"
                  className={`form-control${passwordMismatch ? " is-invalid" : ""}`}
                  placeholder="Re-enter your password"
                  value={formData.passwordConfirm}
                  onChange={changeHandler}
                  autoComplete="new-password"
                  required
                />
              </div>

              <button
                id="register_btn"
                className="btn btn-primary w-100 py-2"
                type="submit"
                disabled={loading || passwordMismatch}
                style={{ borderRadius: "var(--radius-pill)", fontWeight: 700 }}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Creating account...</>
                ) : "Create Account"}
              </button>
            </form>

            <hr className="my-4" />

            <p className="mb-0 text-center" style={{ fontSize: "0.88rem" }}>
              Already on Food Genie? <Link to="/users/login" style={{ fontWeight: 600, color: "var(--brand-green)" }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
