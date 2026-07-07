import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Search from "./Search";
import "../../App.css";
import { logout } from "../../redux/actions/userActions";

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { cartItems = [] } = useSelector((state) => state.cart || {});
  const { isAuthenticated, user } = useSelector((state) => state.user || {});

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <>
      <nav className="navbar row sticky-top">
        {/* logo */}
        <div className="col-12 col-md-3">
          <Link to="/">
            <img src="/images/logo.webp" alt="logo" className="logo" />
          </Link>
        </div>

        {/* search bar and search icon */}

        <div className="col-12 col-md-3 mt-2 mt-md-0 ">
          {(location.pathname === "/" ||
            location.pathname.startsWith("/eats/stores/search/")) && <Search />}
        </div>

        {/* Login */}
        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          {/* ml-> margin left (3unit from left) */}
          <Link to="/cart" style={{ textDecoration: "none" }}>
            <span className="ml-3" id="cart">
              Cart
            </span>
            <span className="ml-1" id="cart_count">
              {cartItems.length}
            </span>
          </Link>
          <Link to="/orders" style={{ textDecoration: "none" }}>
            <span className="ml-3" id="cart">
              Orders
            </span>
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/account" style={{ textDecoration: "none" }}>
                <span className="ml-3" id="cart">
                  {user?.name?.split(" ")[0] || "Account"}
                </span>
              </Link>
              <button
                type="button"
                className="btn btn-sm btn-light ml-3"
                onClick={logoutHandler}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/users/login"
              className="material-symbols-outlined web_logo"
            >
              account_circle
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
