import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders, cancelOrder } from "../redux/actions/orderActions";
import { clearCancelState } from "../redux/slices/orderSlice";

// ── Helpers ─────────────────────────────────────────────────
const statusClass = (status) => {
  if (!status) return "processing";
  const s = status.toLowerCase();
  if (s === "delivered") return "delivered";
  if (s === "cancelled") return "cancelled";
  return "processing";
};

const statusIcon = (status) => {
  if (!status) return "⏳";
  const s = status.toLowerCase();
  if (s === "delivered") return "✅";
  if (s === "cancelled") return "❌";
  return "⏳";
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
    month: "short",
    year: "numeric",
  });
};

// ── Confirmation Modal ──────────────────────────────────────
const CancelModal = ({ order, onConfirm, onClose, loading }) => {
  const [reason, setReason] = useState("");

  if (!order) return null;

  return (
    <div className="cancel-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="cancel-modal-title">
      <div className="cancel-modal-box">
        <div className="cancel-modal-header">
          <div className="cancel-modal-icon">🚫</div>
          <h2 id="cancel-modal-title" className="cancel-modal-title">Cancel Order?</h2>
          <p className="cancel-modal-subtitle">
            Order <strong>#{order._id.slice(-8).toUpperCase()}</strong> from{" "}
            <strong>{order.restaurant?.name || "Restaurant"}</strong>
          </p>
        </div>

        <div className="cancel-modal-body">
          {/* Reason */}
          <div className="cancel-reason-group">
            <label htmlFor="cancel_reason" className="cancel-reason-label">
              Reason for cancellation{" "}
              <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span>
            </label>
            <select
              id="cancel_reason"
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

          {/* Order total reminder */}
          <div className="cancel-order-amount">
            <span>Order Total</span>
            <span className="cancel-amount-value">Rs. {order.finalTotal?.toFixed(2)}</span>
          </div>

          <p className="cancel-refund-note">
            💳 If you paid online, a refund will be initiated within 5–7 business days.
          </p>
        </div>

        <div className="cancel-modal-footer">
          <button
            id="cancel_modal_back_btn"
            className="btn cancel-modal-back"
            onClick={onClose}
            disabled={loading}
          >
            Keep Order
          </button>
          <button
            id="cancel_modal_confirm_btn"
            className="btn cancel-modal-confirm"
            onClick={() => onConfirm(reason || "Cancelled by user")}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Cancelling…</>
            ) : (
              "Yes, Cancel Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ──────────────────────────────────────────
const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders = [], listLoading, listError, cancelLoading, cancelError, cancelSuccess } = useSelector(
    (state) => state.orders || {}
  );
  const { isAuthenticated } = useSelector((state) => state.user || {});

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchMyOrders());
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (cancelSuccess) {
      setTimeout(() => {
        setToast({ type: "success", message: "Order cancelled successfully. Refund (if applicable) will be processed within 5–7 business days." });
        setSelectedOrder(null);
      }, 0);
      dispatch(clearCancelState());
    }
    if (cancelError) {
      setTimeout(() => {
        setToast({ type: "error", message: cancelError });
      }, 0);
      dispatch(clearCancelState());
    }
  }, [cancelSuccess, cancelError, dispatch]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleCancelConfirm = async (reason) => {
    if (!selectedOrder) return;
    await dispatch(cancelOrder(selectedOrder._id, reason));
  };

  // ── Not logged in ──
  if (!isAuthenticated) {
    return (
      <div className="container py-5 text-center">
        <div className="empty-state">
          <div className="mb-3" style={{ fontSize: "3rem" }}>🔒</div>
          <h3>Sign in to view orders</h3>
          <p className="text-muted">Your order history will appear here once you&apos;re logged in.</p>
          <Link to="/users/login" className="btn btn-primary mt-2">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="page-title">My Orders</h1>

      {/* ── Toast notification ── */}
      {toast && (
        <div className={`orders-toast orders-toast--${toast.type}`} role="alert">
          <span>{toast.type === "success" ? "✅" : "❌"} {toast.message}</span>
          <button className="orders-toast-close" onClick={() => setToast(null)} aria-label="Dismiss">×</button>
        </div>
      )}

      {/* ── Cancellation policy banner ── */}
      <div className="cancel-policy-banner">
        <span className="cancel-policy-icon">ℹ️</span>
        <span>
          <strong>Cancellation Policy:</strong> You can cancel any{" "}
          <strong>Processing</strong> order at any time before it&apos;s delivered.
        </span>
      </div>

      {listLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading orders...</span>
          </div>
        </div>
      ) : listError ? (
        <div className="alert alert-danger rounded-3">{listError}</div>
      ) : orders.length === 0 ? (
        <div className="empty-state py-5">
          <div className="mb-3" style={{ fontSize: "3rem" }}>📦</div>
          <h4>No orders yet</h4>
          <p className="text-muted">When you place an order, it&apos;ll show up here.</p>
          <Link to="/" className="btn btn-primary mt-2">Browse Restaurants</Link>
        </div>
      ) : (
        <>
          {/* ── Desktop Table (hidden on mobile) ── */}
          <div className="orders-table-wrapper d-none d-md-block">
            <div className="table-responsive">
              <table className="table" aria-label="My orders list">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Restaurant</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <span className="font-monospace text-muted" style={{ fontSize: "0.82rem" }}>
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        {formatDate(order.createdAt)}
                      </td>
                      <td>{order.restaurant?.name || "Restaurant"}</td>
                      <td>
                        <span className={`status-badge ${statusClass(order.orderStatus)}`}>
                          {statusIcon(order.orderStatus)} {order.orderStatus || "Processing"}
                        </span>
                      </td>
                      <td className="fw-bold">Rs. {order.finalTotal?.toFixed(2)}</td>
                      <td>
                        <div className="d-flex gap-2 align-items-center flex-wrap">
                          <Link
                            to={`/orders/${order._id}`}
                            id={`details_btn_${order._id}`}
                            className="btn btn-sm btn-outline-success"
                          >
                            Details
                          </Link>
                          {canCancel(order) && (
                            <button
                              id={`cancel_btn_${order._id}`}
                              className="btn btn-sm btn-cancel-order"
                              onClick={() => setSelectedOrder(order)}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Mobile Cards (shown only on mobile) ── */}
          <div className="d-md-none order-cards-list">
            {orders.map((order) => (
              <div key={order._id} className="order-mobile-card">
                <div className="order-card-top">
                  <div>
                    <span className="order-card-id">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className="order-card-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <span className={`status-badge ${statusClass(order.orderStatus)}`}>
                    {statusIcon(order.orderStatus)} {order.orderStatus || "Processing"}
                  </span>
                </div>

                <div className="order-card-restaurant">
                  🍽️ {order.restaurant?.name || "Restaurant"}
                </div>

                <div className="order-card-items">
                  {order.orderItems?.slice(0, 2).map((item, i) => (
                    <span key={i} className="order-card-item-tag">{item.name} ×{item.quantity}</span>
                  ))}
                  {(order.orderItems?.length || 0) > 2 && (
                    <span className="order-card-item-tag order-card-more">
                      +{order.orderItems.length - 2} more
                    </span>
                  )}
                </div>

                <div className="order-card-footer">
                  <span className="order-card-total">Rs. {order.finalTotal?.toFixed(2)}</span>
                  <div className="order-card-actions">
                    <Link
                      to={`/orders/${order._id}`}
                      id={`details_mobile_btn_${order._id}`}
                      className="btn btn-sm btn-outline-success"
                    >
                      Details
                    </Link>
                    {canCancel(order) && (
                      <button
                        id={`cancel_mobile_btn_${order._id}`}
                        className="btn btn-sm btn-cancel-order"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Cancel Confirmation Modal ── */}
      {selectedOrder && (
        <CancelModal
          order={selectedOrder}
          onConfirm={handleCancelConfirm}
          onClose={() => { setSelectedOrder(null); dispatch(clearCancelState()); }}
          loading={cancelLoading}
        />
      )}
    </div>
  );
};

export default MyOrders;
