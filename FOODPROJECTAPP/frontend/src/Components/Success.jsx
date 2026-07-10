import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../utils/api";
import { clearCart } from "../redux/slices/cartSlice";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setTimeout(() => {
        setError("No session ID found. Cannot complete order.");
        setLoading(false);
      }, 0);
      return;
    }

    const verifyPaymentAndCreateOrder = async () => {
      try {
        const { data } = await api.post("/v1/eats/orders/new", {
          session_id: sessionId,
        });

        if (data?.success && data?.order?._id) {
          dispatch(clearCart());
          // Wait 2 seconds to show the success checkmark, then navigate to order details page
          setTimeout(() => {
            navigate(`/orders/${data.order._id}`);
          }, 2000);
        } else {
          setError("Failed to create order on the server.");
          setLoading(false);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "An error occurred.");
        setLoading(false);
      }
    };

    verifyPaymentAndCreateOrder();
  }, [sessionId, dispatch, navigate]);

  return (
    <div className="container py-5 d-flex flex-column align-items-center justify-content-center min-vh-75">
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary mb-4" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Verifying payment...</span>
          </div>
          <h4>Verifying your payment...</h4>
          <p className="text-muted">Please do not refresh the page or click back.</p>
        </div>
      ) : error ? (
        <div className="card shadow-sm p-4 text-center border-danger" style={{ maxWidth: "500px" }}>
          <div className="text-danger mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
            </svg>
          </div>
          <h3 className="text-danger">Order Verification Failed</h3>
          <p className="mt-3">{error}</p>
          <button className="btn btn-outline-danger mt-3" onClick={() => navigate("/cart")}>Return to Cart</button>
        </div>
      ) : (
        <div className="card shadow-lg p-5 text-center border-success" style={{ maxWidth: "500px", borderRadius: "15px" }}>
          <div className="text-success mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
          </div>
          <h2 className="text-success mb-2">Payment Successful!</h2>
          <p className="text-muted">Your order is being processed.</p>
          <p className="small text-muted mt-2">Redirecting to order details...</p>
        </div>
      )}
    </div>
  );
};

export default Success;
