import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Components/Home";
import Header from "./Components/layout/Header";
import Footer from "./Components/layout/Footer";
import Menu from "./Components/Menu";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Cart from "./Components/Cart";
import Checkout from "./Components/Checkout";
import OrderDetails from "./Components/OrderDetails";
import MyOrders from "./Components/MyOrders";
import Account from "./Components/Account";
import { loadUser } from "./redux/actions/userActions";
import { fetchCart } from "./redux/actions/cartActions";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user || {});

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <ToastContainer />
      <Router>
        <div className="App">
          <Header />
          <main className="container-fluid px-4 py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/users/login" element={<Login />} />
              <Route path="/users/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/account" element={<Account />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/eats/stores/search/:keyword" element={<Home />} />
              <Route path="/eats/stores/:id/menus" element={<Menu />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
