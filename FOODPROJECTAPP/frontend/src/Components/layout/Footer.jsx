import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="content-container">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} <strong style={{ color: "#fff" }}>FoodEats</strong> — All Rights Reserved
          </p>
          <div className="d-flex gap-3">
            <Link to="/" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem" }}>Home</Link>
            <Link to="/orders" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem" }}>Orders</Link>
            <Link to="/cart" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem" }}>Cart</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
