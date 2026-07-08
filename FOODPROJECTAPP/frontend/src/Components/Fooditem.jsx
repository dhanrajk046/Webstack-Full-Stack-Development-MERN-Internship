import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { addItemToCart } from "../redux/actions/cartActions";
import api from "../utils/api";

const Fooditem = ({ fooditem, restaurant }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user || {});
  const [quantity, setQuantity] = useState(1);
  const [showButtons, setShowButtons] = useState(false);

  // AI Description Generator state
  const [showAi, setShowAi] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDescription, setAiDescription] = useState("");
  const [aiError, setAiError] = useState("");

  const addToCartHandler = () => {
    setShowButtons(true);
    setQuantity(1);
  };

  const confirmAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = "/users/login";
      return;
    }

    const restaurantId =
      restaurant || fooditem.restaurant?._id || fooditem.restaurant || null;

    if (!restaurantId) {
      return;
    }

    await dispatch(
      addItemToCart(
        fooditem._id,
        restaurantId,
        quantity,
      ),
    );
    setShowButtons(false);
    setQuantity(1);
  };

  // Increase quantity
  const increaseQty = () => {
    if (quantity < fooditem.stock) {
      setQuantity(quantity + 1);
    }
  };

  // Decrease quantity
  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      // if 0 → go back to Add button
      setShowButtons(false);
      setQuantity(1);
    }
  };

  const handleGenerateAiDescription = async () => {
    setShowAi(true);
    if (aiDescription) return; // don't re-fetch if already generated
    setAiLoading(true);
    setAiError("");
    try {
      const { data } = await api.post("/ai/generate-description", {
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

  const fallbackImage = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="10" fill="%23f3f4f6"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="40">🍲</text></svg>';

  return (
    <div className="col-sm-12 col-md-6 col-lg-3 my-3">
      <div className="card p-3 rounded h-100 d-flex flex-column justify-content-between">
        <div>
          <img
            className="card-img-top mx-auto food-image"
            src={fooditem.images?.[0]?.url || fallbackImage}
            alt={fooditem.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }}
          />

          <div className="card-body d-flex flex-column p-0 mt-3">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h5 className="card-title mb-0" style={{ fontWeight: 700, fontSize: "1rem" }}>{fooditem.name}</h5>
              <button
                className="btn btn-sm btn-outline-info rounded-pill py-0 px-2"
                onClick={handleGenerateAiDescription}
                title="Generate AI Description"
                style={{ fontSize: "0.72rem", border: "1px solid #0dcaf0" }}
              >
                🪄 AI Describe
              </button>
            </div>

            {/* AI Expanded Section */}
            {showAi && (
              <div className="ai-desc-box p-2 mb-2 rounded bg-light border-start border-info border-3" style={{ fontSize: "0.8rem", position: "relative" }}>
                <button
                  className="btn-close"
                  onClick={() => setShowAi(false)}
                  style={{ position: "absolute", top: "5px", right: "5px", fontSize: "0.55rem" }}
                  aria-label="Close AI box"
                />
                <strong className="text-info d-block mb-1">✨ Genie Says:</strong>
                {aiLoading ? (
                  <span className="text-muted placeholder-glow">
                    <span className="placeholder col-12"></span>
                  </span>
                ) : aiError ? (
                  <span className="text-danger">{aiError}</span>
                ) : (
                  <p className="mb-0 text-dark" style={{ lineHeight: 1.4, fontStyle: "italic" }}>{aiDescription}</p>
                )}
              </div>
            )}

            {!showAi && <p className="fooditem_des" style={{ fontSize: "0.85rem", color: "var(--text-muted)", height: "60px", overflow: "hidden", textOverflow: "ellipsis" }}>{fooditem.description}</p>}

            <p className="card-text fw-bold" style={{ color: "var(--brand-green)", fontSize: "1.05rem" }}>
              <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />
              &nbsp;{fooditem.price}
            </p>
          </div>
        </div>

        <div>
          {/*BUTTON LOGIC */}
          {!showButtons ? (
            <button
              type="button"
              id="cart_btn"
              className="btn btn-primary w-100 mt-2"
              disabled={fooditem.stock === 0}
              onClick={addToCartHandler}
            >
              Add to Cart
            </button>
          ) : (
            <div className="stockCounter d-flex align-items-center mt-2 w-100 justify-content-between">
              <button className="btn btn-danger" onClick={decreaseQty}>
                -
              </button>

              <input
                type="number"
                className="form-control text-center mx-1"
                value={quantity}
                readOnly
                style={{ width: "45px", padding: "0.25rem" }}
              />

              <button className="btn btn-primary" onClick={increaseQty}>
                +
              </button>
              <button
                className="btn btn-success ms-2"
                onClick={confirmAddToCart}
              >
                Add
              </button>
            </div>
          )}

          <hr className="my-2" />

          <p className="mb-0" style={{ fontSize: "0.8rem" }}>
            Status:{" "}
            <span className={fooditem.stock > 0 ? "greenColor" : "redColor"} style={{ fontWeight: 700 }}>
              {fooditem.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Fooditem;
