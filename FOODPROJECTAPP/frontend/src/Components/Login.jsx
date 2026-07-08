import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../redux/actions/userActions";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.user || {},
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/cart");
    }
  }, [isAuthenticated, navigate]);

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5 col-xl-4">
          <div className="form-card">
            {/* Brand header */}
            <div className="text-center mb-4">
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🧞</div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.25rem" }}>Welcome back</h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: 0 }}>Sign in to your Food Genie account</p>
            </div>

            {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

            <form onSubmit={submitHandler} noValidate>
              <div className="mb-3">
                <label htmlFor="email_field" className="form-label">Email address</label>
                <input
                  id="email_field"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password_field" className="form-label">Password</label>
                <input
                  id="password_field"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                id="login_btn"
                className="btn btn-primary w-100 py-2"
                disabled={loading}
                style={{ borderRadius: "var(--radius-pill)", fontWeight: 700 }}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Signing in...</>
                ) : "Sign In"}
              </button>
            </form>

            <hr className="my-4" />

            <p className="mb-2 text-center" style={{ fontSize: "0.88rem" }}>
              <Link to="/" style={{ color: "var(--text-muted)" }}>← Back to restaurants</Link>
            </p>
            <p className="mb-0 text-center" style={{ fontSize: "0.88rem" }}>
              New to Food Genie? <Link to="/users/register" style={{ fontWeight: 600, color: "var(--brand-green)" }}>Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
