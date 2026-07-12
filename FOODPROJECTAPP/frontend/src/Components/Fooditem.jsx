import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { addItemToCart, updateCartQuantity, removeCartItem } from "../redux/actions/cartActions";
import api from "../utils/api";

const Fooditem = ({ fooditem, restaurant }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user || {});

  // Redux Cart State
  const { cartItems = [], restaurant: cartRestaurant, loading: cartLoading } = useSelector(
    (state) => state.cart || {}
  );

  const cartItem = cartItems.find(
    (item) => (item.foodItem?._id || item.foodItem || item._id) === fooditem._id
  );
  const cartQty = cartItem ? cartItem.quantity : 0;

  // AI Description Generator state
  const [showAi, setShowAi] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDescription, setAiDescription] = useState("");
  const [aiError, setAiError] = useState("");

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = "/users/login";
      return;
    }

    const currentRestaurantId =
      restaurant || fooditem.restaurant?._id || fooditem.restaurant || null;

    if (!currentRestaurantId) return;

    const cartRestaurantId = cartRestaurant?._id || cartRestaurant;
    if (
      cartItems.length > 0 &&
      cartRestaurantId &&
      cartRestaurantId.toString() !== currentRestaurantId.toString()
    ) {
      const confirmChange = window.confirm(
        "Your cart contains items from a different restaurant. Adding this item will discard your current cart. Do you want to proceed?"
      );
      if (!confirmChange) return;
    }

    dispatch(addItemToCart(fooditem._id, currentRestaurantId, 1));
  };

  const handleIncrease = () => {
    if (cartQty < fooditem.stock) {
      dispatch(updateCartQuantity(fooditem._id, cartQty + 1));
    }
  };

  const handleDecrease = () => {
    if (cartQty > 1) {
      dispatch(updateCartQuantity(fooditem._id, cartQty - 1));
    } else {
      dispatch(removeCartItem(fooditem._id));
    }
  };

  const handleGenerateAiDescription = async () => {
    setShowAi(true);
    if (aiDescription) return; // don't re-fetch if already generated
    setAiLoading(true);
    setAiError("");
    try {
      const { data } = await api.post("/v1/ai/generate-description", {
        name: fooditem.name,
        currentDescription: fooditem.description,
      });
      if (data?.success) {
        setAiDescription(data.description);
      } else {
        setAiError("Unable to generate description.");
      }
    } catch (err) {
      setAiError(err.response?.data?.message || err.message || "Failed to call AI.");
    } finally {
      setAiLoading(false);
    }
  };

  const fallbackImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="10" fill="%23f3f4f6"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="40">🍲</text></svg>';

  const isOutOfStock = fooditem.stock === 0;

  return (
    <div className="col-6 col-sm-6 col-md-4 col-lg-3 my-2">
      <div
        className="card h-100 d-flex flex-column"
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          transition: "box-shadow 0.2s, transform 0.2s",
          padding: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.13)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img
            className="food-image w-100"
            src={fooditem.images?.[0]?.url || fallbackImage}
            alt={fooditem.name}
            style={{ height: "160px", objectFit: "cover", display: "block" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }}
          />
          {isOutOfStock && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.45)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <span style={{
                background: "#dc2626", color: "#fff",
                padding: "4px 12px", borderRadius: "20px",
                fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.03em"
              }}>Out of Stock</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="d-flex flex-column" style={{ padding: "0.75rem", flex: 1 }}>
          {/* Name + AI button */}
          <div className="d-flex justify-content-between align-items-start gap-1 mb-1">
            <h5
              className="mb-0"
              style={{
                fontWeight: 700,
                fontSize: "clamp(0.78rem, 2.5vw, 0.92rem)",
                lineHeight: 1.3,
                color: "#1a1a1a",
                flex: 1
              }}
            >
              {fooditem.name}
            </h5>
            <button
              className="flex-shrink-0"
              onClick={handleGenerateAiDescription}
              title="Generate AI Description"
              id={`ai-btn-${fooditem._id}`}
              style={{
                fontSize: "0.65rem",
                border: "1px solid #0dcaf0",
                background: "rgba(13,202,240,0.08)",
                color: "#0891b2",
                borderRadius: "20px",
                padding: "2px 7px",
                cursor: "pointer",
                fontWeight: 600,
                whiteSpace: "nowrap",
                lineHeight: "1.6",
              }}
            >
              🪄 AI
            </button>
          </div>

          {/* AI Expanded Section */}
          {showAi && (
            <div
              className="mb-2 rounded"
              style={{
                fontSize: "0.75rem",
                position: "relative",
                background: "#f0f9ff",
                border: "1px solid #bae6fd",
                borderLeft: "3px solid #0891b2",
                padding: "0.5rem 0.6rem",
              }}
            >
              <button
                className="btn-close"
                onClick={() => setShowAi(false)}
                style={{ position: "absolute", top: "4px", right: "4px", fontSize: "0.5rem" }}
                aria-label="Close AI box"
              />
              <strong style={{ color: "#0891b2", display: "block", marginBottom: "3px", fontSize: "0.72rem" }}>
                ✨ Genie Says:
              </strong>
              {aiLoading ? (
                <span className="text-muted placeholder-glow">
                  <span className="placeholder col-12"></span>
                  <span className="placeholder col-10"></span>
                </span>
              ) : aiError ? (
                <span style={{ color: "#dc2626" }}>{aiError}</span>
              ) : (
                <p className="mb-0" style={{ lineHeight: 1.45, fontStyle: "italic", color: "#1e3a5f" }}>
                  {aiDescription}
                </p>
              )}
            </div>
          )}

          {/* Original description — hide when AI shown */}
          {!showAi && (
            <p
              className="fooditem_des mb-1"
              style={{
                fontSize: "0.78rem",
                color: "#6b7280",
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {fooditem.description}
            </p>
          )}

          {/* Price */}
          <p className="mb-0" style={{ color: "var(--brand-green)", fontSize: "1rem", fontWeight: 800 }}>
            <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />
            &nbsp;{fooditem.price}
          </p>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Cart Controls */}
          <div className="mt-2">
            {cartQty === 0 ? (
              <button
                type="button"
                id="cart_btn"
                className="btn btn-primary w-100"
                style={{ fontSize: "0.82rem", padding: "0.45rem 0.75rem", borderRadius: "20px", height: "36px" }}
                disabled={isOutOfStock || cartLoading}
                onClick={handleAddToCart}
              >
                {cartLoading ? "Adding..." : (isOutOfStock ? "Out of Stock" : "Add to Cart")}
              </button>
            ) : (
              <div className="d-flex align-items-center justify-content-between w-100" style={{ height: "36px" }}>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  disabled={cartLoading}
                  onClick={handleDecrease}
                  style={{ height: "36px", width: "36px", borderRadius: "8px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  −
                </button>
                <span style={{ fontWeight: "700", fontSize: "0.95rem", color: "#1f2937" }}>
                  {cartLoading ? "..." : cartQty}
                </span>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={cartLoading || (fooditem.stock > 0 && cartQty >= fooditem.stock)}
                  onClick={handleIncrease}
                  style={{ height: "36px", width: "36px", borderRadius: "8px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  +
                </button>
              </div>
            )}
          </div>

          {/* In Stock status */}
          <p className="mb-0 mt-1" style={{ fontSize: "0.72rem" }}>
            <span className={isOutOfStock ? "redColor" : "greenColor"} style={{ fontWeight: 600 }}>
              {isOutOfStock ? "● Out of Stock" : "● In Stock"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Fooditem;
