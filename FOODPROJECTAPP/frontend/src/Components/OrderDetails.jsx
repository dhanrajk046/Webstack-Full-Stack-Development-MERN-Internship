import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails, cancelOrder } from "../redux/actions/orderActions";
import { clearCancelState } from "../redux/slices/orderSlice";

// ── Helpers ─────────────────────────────────────────────────
const statusClass = (status) => {
  if (!status) return "processing";
  const s = status.toLowerCase();
  if (s === "delivered") return "delivered";
  if (s === "cancelled") return "cancelled";
  return "processing";
};

// Any non-delivered, non-cancelled order can be cancelled
const canCancel = (order) => {
  if (!order) return false;
  const s = (order.orderStatus || "").toLowerCase();
  return s !== "delivered" && s !== "cancelled";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "–";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ── Cancel Inline Panel ──────────────────────────────────────
const CancelPanel = ({ onConfirm, onClose, loading }) => {
  const [reason, setReason] = useState("");

  return (
    <div className="cancel-inline-panel">
      <h5 className="cancel-inline-title">🚫 Cancel this order?</h5>

      <div className="mb-3">
        <label htmlFor="detail_cancel_reason" className="form-label" style={{ fontSize: "0.88rem", fontWeight: 600 }}>
          Reason <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span>
        </label>
        <select
          id="detail_cancel_reason"
          className="form-control cancel-reason-select"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="">Select a reason…</option>
          <option value="Ordered by mistake">Ordered by mistake</option>
          <option value="Found a better price elsewhere">Found a better price elsewhere</option>
          <option value="Changed my mind">Changed my mind</option>
          <option value="Delivery time too long">Delivery time too long</option>
          <option value="Duplicate order">Duplicate order</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <p className="cancel-refund-note mb-3">
        💳 If you paid online, a refund will be initiated within 5–7 business days.
      </p>

      <div className="d-flex gap-2">
        <button
          id="detail_cancel_back_btn"
          className="btn cancel-modal-back flex-fill"
          onClick={onClose}
          disabled={loading}
        >
          Keep Order
        </button>
        <button
          id="detail_cancel_confirm_btn"
          className="btn cancel-modal-confirm flex-fill"
          onClick={() => onConfirm(reason || "Cancelled by user")}
          disabled={loading}
        >
          {loading ? (
            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Cancelling…</>
          ) : (
            "Confirm Cancel"
          )}
        </button>
      </div>
    </div>
  );
};

// ── Main Component ──────────────────────────────────────────
const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    orderDetails: order,
    detailsLoading,
    detailsError,
    cancelLoading,
    cancelError,
    cancelSuccess,
  } = useSelector((state) => state.orders || {});

  const [showCancelPanel, setShowCancelPanel] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (cancelSuccess) {
      // Redirect back to orders page - MyOrders will display the success toast
      navigate("/orders");
    }
    if (cancelError) {
      setTimeout(() => {
        setToast({ type: "error", message: cancelError });
      }, 0);
      dispatch(clearCancelState());
    }
  }, [cancelSuccess, cancelError, dispatch, navigate]);


  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleCancelConfirm = async (reason) => {
    await dispatch(cancelOrder(order._id, reason));
  };

  if (detailsLoading || !order || Object.keys(order).length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading order...</span>
        </div>
      </div>
    );
  }

  if (detailsError) {
    return <div className="container py-5 alert alert-danger">{detailsError}</div>;
  }

  const isCancelled = (order.orderStatus || "").toLowerCase() === "cancelled";

  return (
    <div className="container py-4">

      {/* ── Toast ── */}
      {toast && (
        <div className={`orders-toast orders-toast--${toast.type}`} role="alert">
          <span>{toast.type === "success" ? "✅" : "❌"} {toast.message}</span>
          <button className="orders-toast-close" onClick={() => setToast(null)} aria-label="Dismiss">×</button>
        </div>
      )}

      {/* ── Order header ── */}
      <div className="order-detail-header">
        <div>
          <h1 className="page-title mb-1">Order Details</h1>
          <div className="order-id-badge">
            📦 Order #{order._id.slice(-8).toUpperCase()} &nbsp;·&nbsp; Placed on {formatDate(order.createdAt)}
          </div>
        </div>
        <span className={`status-badge ${statusClass(order.orderStatus)}`} style={{ fontSize: "0.9rem", padding: "6px 14px" }}>
          {order.orderStatus || "Processing"}
        </span>
      </div>

      {/* Cancelled notice */}
      {isCancelled && (
        <div className="cancel-notice-banner">
          ❌ This order was cancelled{order.cancelledAt ? ` on ${formatDate(order.cancelledAt)}` : ""}.
          {order.cancelledReason && <> Reason: <em>{order.cancelledReason}</em>.</>}
        </div>
      )}

      <div className="row mt-4">
        {/* ── Items ── */}
        <div className="col-lg-8">
          <h3 className="mb-4" style={{ fontSize: "1.2rem", fontWeight: 700 }}>Items Ordered</h3>

          {order.orderItems?.map((item) => {
            const fallbackImage = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="10" fill="%23f3f4f6"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="40">🍲</text></svg>';
            return (
              <div className="cart-item row align-items-center mb-3 shadow-sm p-2 rounded" key={item.fooditem}>
                <div className="col-4 col-md-2">
                  <img
                    src={item.image || fallbackImage}
                    alt={item.name}
                    className="img-fluid rounded"
                    style={{ height: "64px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImage;
                    }}
                  />
                </div>
              <div className="col-8 col-md-6">
                <h5 className="mb-1" style={{ fontSize: "0.95rem", fontWeight: 600 }}>{item.name}</h5>
                <p className="mb-0 text-muted" style={{ fontSize: "0.85rem" }}>Qty: {item.quantity}</p>
              </div>
              <div className="col-12 col-md-4 text-md-end mt-2 mt-md-0 fw-bold" style={{ color: "var(--brand-orange)" }}>
                Rs. {(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          );
        })}
        </div>

        {/* ── Summary sidebar ── */}
        <div className="col-lg-4 mt-4 mt-lg-0">
          <div id="order_summary">
            <h4 className="mb-3" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Order Summary</h4>

            <p className="mb-1">
              <strong>Status:</strong>{" "}
              <span className={`status-badge ${statusClass(order.orderStatus)}`} style={{ fontSize: "0.78rem" }}>
                {order.orderStatus}
              </span>
            </p>
            <p className="mb-1"><strong>Payment:</strong> {order.paymentInfo?.status || "Not available"}</p>

            {order.restaurant?.name && (
              <p className="mb-3"><strong>Restaurant:</strong> {order.restaurant.name}</p>
            )}

            <hr />
            <p className="d-flex justify-content-between mb-1">
              <span>Subtotal</span>
              <span className="order-summary-values">Rs. {order.itemsPrice?.toFixed(2) || 0}</span>
            </p>
            <p className="d-flex justify-content-between mb-1">
              <span>Tax</span>
              <span className="order-summary-values">Rs. {order.taxPrice?.toFixed(2) || 0}</span>
            </p>
            <p className="d-flex justify-content-between mb-3">
              <span>Delivery</span>
              <span className="order-summary-values">Rs. {order.deliveryCharge?.toFixed(2) || 0}</span>
            </p>

            <h5 className="d-flex justify-content-between" style={{ color: "var(--brand-green)" }}>
              <span>Total</span>
              <span className="order-summary-values">Rs. {order.finalTotal?.toFixed(2) || 0}</span>
            </h5>

            <hr />
            <h5 className="mb-2" style={{ fontSize: "1rem" }}>Delivery Address</h5>
            <p className="mb-1 text-muted">{order.deliveryInfo?.address}</p>
            <p className="mb-1 text-muted">{order.deliveryInfo?.city}, {order.deliveryInfo?.postalCode}</p>
            <p className="mb-3 text-muted">{order.deliveryInfo?.phoneNo}</p>

            {/* ── Cancel button ── */}
            {canCancel(order) && !showCancelPanel && (
              <>
                <hr />
                <button
                  id="cancel_order_details_btn"
                  className="btn btn-cancel-order w-100 mt-2"
                  onClick={() => setShowCancelPanel(true)}
                >
                  Cancel Order
                </button>
              </>
            )}

            {/* ── Cancel panel ── */}
            {canCancel(order) && showCancelPanel && (
              <CancelPanel
                order={order}
                onConfirm={handleCancelConfirm}
                onClose={() => { setShowCancelPanel(false); dispatch(clearCancelState()); }}
                loading={cancelLoading}
              />
            )}

            {/* Already cancelled notice */}
            {isCancelled && (
              <div className="mt-3 p-3" style={{ background: "#fef2f2", borderRadius: "var(--radius-sm)", border: "1px solid #fecaca" }}>
                <p className="mb-0" style={{ fontSize: "0.85rem", color: "#dc2626" }}>
                  ❌ This order has been cancelled.
                </p>
              </div>
            )}

            <Link to="/orders" id="back_to_orders_btn" className="btn btn-primary w-100 mt-3">
              ← My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;