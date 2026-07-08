import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="content-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">🧞 Food Genie</div>
            <p className="footer-tagline">Your wish is our command. Fresh meals delivered fast to your doorstep.</p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook" className="social-link"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" aria-label="Instagram" className="social-link"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" aria-label="Twitter" className="social-link"><i className="fa-brands fa-x-twitter"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h6 className="footer-heading">Quick Links</h6>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/orders" className="footer-link">My Orders</Link>
            <Link to="/cart" className="footer-link">Cart</Link>
            <Link to="/account" className="footer-link">My Account</Link>
          </div>

          {/* Info */}
          <div className="footer-links-col">
            <h6 className="footer-heading">Information</h6>
            <a href="#" className="footer-link">About Us</a>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Contact Us</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} <strong style={{ color: "#fff" }}>Food Genie</strong> — All Rights Reserved
          </p>
          <p className="mb-0 footer-tagline-sm">Made with ❤️ for food lovers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
