import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Search from "./Search";
import "../../App.css";
import { logout } from "../../redux/actions/userActions";

import { clearFilters } from "../../redux/slices/restaurantSlice";

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItems = [] } = useSelector((state) => state.cart || {});
  const { isAuthenticated, user } = useSelector((state) => state.user || {});

  const showSearch =
    location.pathname === "/" ||
    location.pathname.startsWith("/eats/stores/search/");

  const logoutHandler = () => {
    dispatch(logout());
    setMenuOpen(false);
  };

  const closeMobileNav = () => setMenuOpen(false);

  const handleLogoClick = () => {
    closeMobileNav();
    dispatch(clearFilters());
  };

  return (
    <header>
      {/* ── Desktop / Tablet Navbar ── */}
      <nav className="app-navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo">
            <Link to="/" onClick={handleLogoClick} style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
              <img src="/images/logo.webp" alt="Food Genie logo" onError={(e) => { e.target.style.display = 'none'; }} />
              <span style={{ color: "#fff", fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>Food Genie™</span>
            </Link>
          </div>

          {/* Search – hidden on mobile (shown in drawer) */}
          {showSearch && (
            <div className="navbar-search">
              <Search />
            </div>
          )}

          {/* Nav Links – hidden on mobile */}
          <div className="navbar-links">
            <Link to="/cart" className="nav-link-item">
              <i className="fa fa-shopping-cart" aria-hidden="true"></i>
              Cart
              {cartItems.length > 0 && (
                <span className="badge">{cartItems.length}</span>
              )}
            </Link>
            <Link to="/orders" className="nav-link-item">
              <i className="fa fa-list-alt" aria-hidden="true"></i>
              Orders
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/account" className="nav-link-item">
                  <i className="fa fa-user-circle" aria-hidden="true"></i>
                  {user?.name?.split(" ")[0] || "Account"}
                </Link>
                <button className="btn-nav-logout" onClick={logoutHandler}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/users/login" className="nav-link-item">
                <i className="fa fa-sign-in" aria-hidden="true"></i>
                Login
              </Link>
            )}
          </div>

          {/* Hamburger toggle – visible only on mobile */}
          <button
            className="navbar-toggle"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle Food Genie navigation"
            aria-expanded={menuOpen}
          >
            <i className={menuOpen ? "fa fa-times" : "fa fa-bars"} aria-hidden="true"></i>
          </button>
        </div>

        {/* ── Mobile Drawer ── */}
        <div className={`mobile-nav${menuOpen ? " open" : ""}`}>
          {showSearch && (
            <div className="mobile-search">
              <Search onSearch={closeMobileNav} />
            </div>
          )}
          <div className="mobile-nav-links">
            <Link to="/cart" className="mobile-nav-link" onClick={closeMobileNav}>
              <i className="fa fa-shopping-cart" aria-hidden="true"></i>
              Cart
              {cartItems.length > 0 && (
                <span className="badge ms-auto">{cartItems.length}</span>
              )}
            </Link>
            <Link to="/orders" className="mobile-nav-link" onClick={closeMobileNav}>
              <i className="fa fa-list-alt" aria-hidden="true"></i>
              My Orders
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/account" className="mobile-nav-link" onClick={closeMobileNav}>
                  <i className="fa fa-user-circle" aria-hidden="true"></i>
                  {user?.name?.split(" ")[0] || "Account"}
                </Link>
                <button
                  className="mobile-nav-link"
                  style={{ background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer", color: "rgba(255,255,255,0.85)" }}
                  onClick={logoutHandler}
                >
                  <i className="fa fa-sign-out" aria-hidden="true"></i>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/users/login" className="mobile-nav-link" onClick={closeMobileNav}>
                <i className="fa fa-sign-in" aria-hidden="true"></i>
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
