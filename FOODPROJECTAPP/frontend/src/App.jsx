import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Components/Home";
import Header from "./Components/layout/Header";
import Footer from "./Components/layout/Footer";
import Menu from "./Components/Menu";

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <div className="App">
          <Header />
          <main className="container-fluid px-4 py-4">
            <Routes>
              <Route path="/" element={<Home />} />
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
