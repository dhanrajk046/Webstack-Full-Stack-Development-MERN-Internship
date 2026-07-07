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

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <form className="p-4 bg-white rounded shadow-sm" onSubmit={submitHandler}>
            <h2 className="mb-4">Create Account</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {clientError && <div className="alert alert-warning">{clientError}</div>}
            {formData.passwordConfirm &&
              formData.password !== formData.passwordConfirm && (
                <div className="alert alert-warning">Passwords must match.</div>
              )}
            <input name="name" className="form-control mb-3" placeholder="Full name" value={formData.name} onChange={changeHandler} required />
            <input name="email" type="email" className="form-control mb-3" placeholder="Email" value={formData.email} onChange={changeHandler} required />
            <input name="phoneNumber" className="form-control mb-3" placeholder="10 digit phone number" pattern="[0-9]{10}" value={formData.phoneNumber} onChange={changeHandler} required />
            <input name="password" type="password" className="form-control mb-3" placeholder="Password" minLength="6" value={formData.password} onChange={changeHandler} required />
            <input name="passwordConfirm" type="password" className="form-control mb-4" placeholder="Confirm password" value={formData.passwordConfirm} onChange={changeHandler} required />
            <button className="btn btn-primary w-100" disabled={loading || formData.password !== formData.passwordConfirm}>
              {loading ? "Creating account..." : "Register"}
            </button>
            <p className="mt-3 mb-0 text-center">
              Already registered? <Link to="/users/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
