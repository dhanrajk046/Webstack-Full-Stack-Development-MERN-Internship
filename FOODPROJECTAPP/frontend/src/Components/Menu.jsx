import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getMenus } from "../redux/actions/menuActions";
import Fooditem from "./Fooditem";
import api from "../utils/api";
import { toast } from "react-toastify";

const Menu = () => {
  const { id: restaurantId } = useParams();
  const dispatch = useDispatch();
  const { menus = [], loading, error } = useSelector(
    (state) => state.menus || {},
  );
  const { isAuthenticated } = useSelector((state) => state.user || {});

  // AI Analyser state
  const [showAnalyser, setShowAnalyser] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [restaurantLoading, setRestaurantLoading] = useState(true);
  const [prevRestaurantId, setPrevRestaurantId] = useState(restaurantId);

  if (restaurantId !== prevRestaurantId) {
    setPrevRestaurantId(restaurantId);
    setRestaurantLoading(true);
  }

  // Add Item / Category Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addItemLoading, setAddItemLoading] = useState(false);
  const [addItemError, setAddItemError] = useState("");
  const [addItemFormData, setAddItemFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "10",
    category: "",
    isNewCategory: false,
    newCategoryName: "",
    image: "",
  });

  // Fetch menu and restaurant details on mount or when restaurantId changes
  useEffect(() => {
    if (restaurantId) {
      dispatch(getMenus(restaurantId));

      api.get(`/v1/eats/stores/${restaurantId}`)
        .then(({ data }) => {
          if (data?.success) {
            setRestaurantInfo(data.data);
          }
        })
        .catch(err => console.error("Failed to load restaurant details:", err))
        .finally(() => setRestaurantLoading(false));
    }
  }, [dispatch, restaurantId]);

  const handleAnalyzeReviews = async () => {
    if (!restaurantInfo) return;
    setAnalysisLoading(true);
    setAnalysisError(null);
    setAnalysisData(null);
    try {
      const { data } = await api.post("/v1/ai/analyze-reviews", {
        name: restaurantInfo.name,
        reviews: restaurantInfo.reviews || [],
      });
      if (data?.success) {
        setAnalysisData(data.analysis);
      } else {
        setAnalysisError("Could not generate analysis. Please try again.");
      }
    } catch (err) {
      setAnalysisError(err.response?.data?.message || err.message || "Failed to analyze reviews.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleOpenAnalyser = () => {
    setShowAnalyser(true);
    if (!analysisData && !analysisLoading) {
      handleAnalyzeReviews();
    }
  };

  const handleAddItemSubmit = async (e) => {
    e.preventDefault();
    setAddItemLoading(true);
    setAddItemError("");

    const categoryToSend = addItemFormData.isNewCategory
      ? addItemFormData.newCategoryName.trim()
      : addItemFormData.category;

    if (!categoryToSend) {
      setAddItemError("Please specify a category.");
      setAddItemLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/v1/eats/menus/manage/addItem", {
        restaurantId,
        category: categoryToSend,
        name: addItemFormData.name,
        price: addItemFormData.price,
        description: addItemFormData.description,
        stock: addItemFormData.stock,
        image: addItemFormData.image,
      });

      if (data?.status === "success") {
        toast.success("Item and Category added successfully!");
        setShowAddModal(false);
        // Reset form
        setAddItemFormData({
          name: "",
          price: "",
          description: "",
          stock: "10",
          category: "",
          isNewCategory: false,
          newCategoryName: "",
          image: "",
        });
        // Refresh menu list
        dispatch(getMenus(restaurantId));
      } else {
        setAddItemError("Failed to add item.");
      }
    } catch (err) {
      setAddItemError(err.response?.data?.message || err.message || "Failed to add menu item.");
    } finally {
      setAddItemLoading(false);
    }
  };

  const handleAddFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddItemFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const getSentimentBadgeColor = (sentiment) => {
    const s = (sentiment || "").toLowerCase();
    if (s.includes("positive")) return { bg: "#d1fae5", color: "#065f46", border: "#6ee7b7" };
    if (s.includes("negative")) return { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" };
    return { bg: "#fef3c7", color: "#92400e", border: "#fcd34d" };
  };

  const reviewCount = restaurantInfo?.reviews?.length || restaurantInfo?.numOfReviews || 0;
  const existingCategories = menus.map(m => m.category).filter(Boolean);

  return (
    <div className="content-container" style={{ paddingTop: "2rem", paddingBottom: "3rem" }}>
      {/* Back link */}
      <Link
        to="/"
        className="d-inline-flex align-items-center gap-1 mb-3 fw-500 text-decoration-none"
        style={{ fontSize: "0.9rem", color: "var(--brand-green)" }}
      >
        <i className="fa fa-arrow-left" aria-hidden="true"></i>
        &nbsp;All Restaurants
      </Link>

      {/* Restaurant Header & Controls */}
      {restaurantLoading ? (
        <div className="restaurant-header-card bg-white rounded shadow-sm p-4 mb-4" style={{ borderLeft: "4px solid var(--brand-green)" }}>
          <div className="placeholder-glow">
            <span className="placeholder col-6 mb-2 d-block" style={{ height: "28px", borderRadius: "6px" }}></span>
            <span className="placeholder col-4 mb-3 d-block" style={{ height: "16px", borderRadius: "6px" }}></span>
            <span className="placeholder col-2 d-block" style={{ height: "28px", borderRadius: "20px" }}></span>
          </div>
        </div>
      ) : restaurantInfo && (
        <div className="restaurant-header-card bg-white rounded shadow-sm p-4 mb-4" style={{ borderLeft: "4px solid var(--brand-green)" }}>
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div style={{ flex: 1 }}>
              <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                <h1 className="restaurant-title mb-0" style={{ fontSize: "clamp(1.2rem, 4vw, 1.75rem)", fontWeight: 800, lineHeight: 1.2 }}>
                  {restaurantInfo.name}
                </h1>
                {restaurantInfo.isVeg && (
                  <span style={{
                    background: "#dcfce7", color: "#166534", border: "1px solid #86efac",
                    borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700,
                    padding: "2px 10px", whiteSpace: "nowrap", flexShrink: 0
                  }}>
                    🥗 Pure Veg
                  </span>
                )}
              </div>
              <p className="text-muted mb-2" style={{ fontSize: "0.875rem" }}>📍 {restaurantInfo.address}</p>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="badge bg-success" style={{ fontSize: "0.82rem", padding: "4px 10px" }}>
                  {restaurantInfo.ratings?.toFixed(1) || "4.0"} ★
                </span>
                <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                  {reviewCount > 0 ? `${reviewCount} review${reviewCount !== 1 ? "s" : ""}` : "No reviews yet"}
                </span>
              </div>
            </div>

            <div className="d-flex gap-2 flex-wrap align-items-center">
              {/* Add New Item Button (visible when logged in) */}
              {isAuthenticated ? (
                <button
                  className="d-flex align-items-center gap-2 fw-600 rounded-pill shadow-sm"
                  id="add-item-btn"
                  onClick={() => setShowAddModal(true)}
                  style={{
                    fontSize: "0.875rem",
                    transition: "all 0.2s",
                    background: "#ffffff",
                    border: "1.5px solid #d1d5db",
                    color: "#374151",
                    padding: "0.5rem 1.1rem",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0
                  }}
                >
                  ➕ <span>Add Menu Item</span>
                </button>
              ) : (
                <Link
                  to="/users/login"
                  className="d-flex align-items-center gap-2 fw-600 rounded-pill shadow-sm text-decoration-none"
                  style={{
                    fontSize: "0.875rem",
                    transition: "all 0.2s",
                    background: "#ffffff",
                    border: "1.5px solid #d1d5db",
                    color: "#374151",
                    padding: "0.5rem 1.1rem",
                    whiteSpace: "nowrap"
                  }}
                >
                  🔒 <span>Login to Add Items</span>
                </Link>
              )}

              {/* AI Review Analyser */}
              <button
                className="d-flex align-items-center gap-2 fw-600 rounded-pill shadow-sm"
                id="ai-analyser-btn"
                onClick={handleOpenAnalyser}
                style={{
                  fontSize: "0.875rem",
                  transition: "all 0.2s",
                  background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                  border: "1.5px solid #86efac",
                  color: "var(--brand-green)",
                  padding: "0.5rem 1.1rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0
                }}
              >
                🪄 <span>AI Review Analyser</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading menu...</span>
          </div>
          <p className="mt-2 text-muted">Loading menu...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger rounded-3">{error}</div>
      ) : !menus || menus.length === 0 ? (
        <div className="empty-state py-5 text-center">
          <div className="mb-3" style={{ fontSize: "3rem" }}>🍽️</div>
          <h4>No menu items yet</h4>
          <p className="text-muted">Check back soon!</p>
        </div>
      ) : (
        menus.map((menu) => (
          <div key={menu._id} className="mb-5">
            {/* Category header */}
            <div className="d-flex align-items-center mb-3 gap-2">
              <h2 className="menu-category-title mb-0" style={{ fontSize: "clamp(1rem, 3vw, 1.3rem)", fontWeight: 700 }}>
                {menu.category}
              </h2>
              <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                ({Array.isArray(menu.items) ? menu.items.length : 0} items)
              </span>
            </div>

            <div className="row g-3">
              {Array.isArray(menu.items) && menu.items.length > 0 ? (
                menu.items.map((fooditem) => (
                  <Fooditem
                    key={fooditem._id}
                    fooditem={fooditem}
                    restaurant={restaurantId}
                  />
                ))
              ) : (
                <p className="text-muted col-12">No items in this category.</p>
              )}
            </div>
          </div>
        ))
      )}

      {/* ── ADD NEW MENU ITEM MODAL ── */}
      {showAddModal && (
        <div className="cancel-modal-overlay" style={{ zIndex: 1050 }} onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}>
          <div className="cancel-modal-box" style={{ maxWidth: "520px", width: "calc(100% - 2rem)" }}>
            <div className="cancel-modal-header" style={{ background: "linear-gradient(135deg, #f9fafb, #f3f4f6)", borderBottom: "1px solid #e5e7eb" }}>
              <div className="cancel-modal-icon" style={{ fontSize: "2rem" }}>🍱</div>
              <h2 className="cancel-modal-title" style={{ color: "var(--text-dark)" }}>Add Menu Item</h2>
              <p className="cancel-modal-subtitle">Add a new dish and category to this restaurant</p>
            </div>

            <form onSubmit={handleAddItemSubmit}>
              <div className="cancel-modal-body" style={{ maxHeight: "65vh", overflowY: "auto", padding: "1.25rem" }}>
                {addItemError && <div className="alert alert-danger py-2" role="alert">{addItemError}</div>}

                {/* Name */}
                <div className="mb-3">
                  <label htmlFor="item_name" className="form-label fw-600">Item Name</label>
                  <input id="item_name" name="name" className="form-control" placeholder="e.g. Masala Dosa" value={addItemFormData.name} onChange={handleAddFormChange} required />
                </div>

                {/* Price & Stock */}
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label htmlFor="item_price" className="form-label fw-600">Price (Rs.)</label>
                    <input id="item_price" name="price" type="number" min="0" step="1" className="form-control" placeholder="e.g. 150" value={addItemFormData.price} onChange={handleAddFormChange} required />
                  </div>
                  <div className="col-6">
                    <label htmlFor="item_stock" className="form-label fw-600">Stock Qty</label>
                    <input id="item_stock" name="stock" type="number" min="0" className="form-control" value={addItemFormData.stock} onChange={handleAddFormChange} required />
                  </div>
                </div>

                {/* Category Selection */}
                <div className="mb-3 border rounded p-3 bg-light">
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" id="isNewCategory" name="isNewCategory" checked={addItemFormData.isNewCategory} onChange={handleAddFormChange} />
                    <label className="form-check-label fw-600 ms-2" htmlFor="isNewCategory">
                      Create a brand new category
                    </label>
                  </div>

                  {addItemFormData.isNewCategory ? (
                    <div>
                      <label htmlFor="new_cat" className="form-label small fw-600">New Category Name</label>
                      <input id="new_cat" name="newCategoryName" className="form-control" placeholder="e.g. South Indian Specials" value={addItemFormData.newCategoryName} onChange={handleAddFormChange} required />
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="item_cat" className="form-label small fw-600">Select Existing Category</label>
                      <select id="item_cat" name="category" className="form-control" value={addItemFormData.category} onChange={handleAddFormChange} required>
                        <option value="">Select a category...</option>
                        {existingCategories.map((cat, i) => (
                          <option key={i} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label htmlFor="item_desc" className="form-label fw-600">Description</label>
                  <textarea id="item_desc" name="description" className="form-control" rows="3" placeholder="Describe the taste, ingredients, serving size..." value={addItemFormData.description} onChange={handleAddFormChange} style={{ height: "auto" }} required />
                </div>

                {/* Image URL */}
                <div className="mb-2">
                  <label htmlFor="item_image" className="form-label fw-600">Image URL (Optional)</label>
                  <input id="item_image" name="image" type="url" className="form-control" placeholder="https://images.unsplash.com/..." value={addItemFormData.image} onChange={handleAddFormChange} />
                  <div className="form-text small text-muted">Leave empty to use a standard food image.</div>
                </div>
              </div>

              <div className="cancel-modal-footer" style={{ borderTop: "1px solid #e5e7eb", padding: "1rem 1.25rem" }}>
                <div className="row g-2">
                  <div className="col-6">
                    <button type="button" className="btn btn-secondary w-100 py-2 rounded-pill fw-600" onClick={() => setShowAddModal(false)} disabled={addItemLoading}>
                      Cancel
                    </button>
                  </div>
                  <div className="col-6">
                    <button type="submit" className="btn btn-primary w-100 py-2 rounded-pill fw-700" disabled={addItemLoading}>
                      {addItemLoading ? "Saving..." : "Add Item"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── AI REVIEW ANALYSER MODAL ── */}
      {showAnalyser && restaurantInfo && (
        <div
          className="cancel-modal-overlay"
          style={{ zIndex: 1050 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAnalyser(false); }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-modal-title"
        >
          <div
            className="cancel-modal-box"
            style={{ maxWidth: "580px", width: "calc(100% - 2rem)", margin: "1rem auto" }}
          >
            {/* Modal Header */}
            <div
              className="cancel-modal-header"
              style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", borderBottom: "1px solid #bbf7d0" }}
            >
              <div className="cancel-modal-icon" style={{ fontSize: "2rem" }}>🪄</div>
              <h2 className="cancel-modal-title" id="ai-modal-title" style={{ color: "var(--brand-green)" }}>
                AI Review Analyser
              </h2>
              <p className="cancel-modal-subtitle">
                Genie's feedback analysis for <strong>{restaurantInfo.name}</strong>
              </p>
            </div>

            {/* Modal Body */}
            <div className="cancel-modal-body" style={{ maxHeight: "70vh", overflowY: "auto", padding: "1.25rem" }}>
              {analysisLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-success mb-3" role="status">
                    <span className="visually-hidden">Analyzing...</span>
                  </div>
                  <h5 style={{ fontWeight: 600 }}>Genie is reading and summarizing reviews...</h5>
                  <p className="text-muted small">Analyzing {reviewCount} customer review{reviewCount !== 1 ? "s" : ""}. This takes just a moment.</p>
                </div>
              ) : analysisError ? (
                <div>
                  <div className="alert alert-danger rounded-3">{analysisError}</div>
                  <button
                    className="btn btn-outline-success w-100 rounded-pill"
                    onClick={handleAnalyzeReviews}
                  >
                    🔄 Try Again
                  </button>
                </div>
              ) : analysisData ? (
                <div>
                  {/* Sentiment Badge */}
                  {(() => {
                    const colors = getSentimentBadgeColor(analysisData.sentiment);
                    return (
                      <div
                        className="d-flex align-items-center justify-content-between mb-4 p-3 rounded-3"
                        style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}
                      >
                        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Overall Customer Sentiment</span>
                        <span
                          style={{
                            background: colors.bg,
                            color: colors.color,
                            border: `1px solid ${colors.border}`,
                            borderRadius: "20px",
                            padding: "4px 14px",
                            fontSize: "0.85rem",
                            fontWeight: 700
                          }}
                        >
                          {analysisData.sentiment}
                        </span>
                      </div>
                    );
                  })()}

                  {/* Verdict */}
                  <div className="mb-4">
                    <h5 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                      💡 Genie's AI Verdict
                    </h5>
                    <p
                      className="p-3 rounded-3"
                      style={{
                        fontSize: "0.875rem",
                        lineHeight: 1.6,
                        fontStyle: "italic",
                        background: "#f0fdf4",
                        borderLeft: "4px solid var(--brand-green)",
                        margin: 0
                      }}
                    >
                      "{analysisData.ai_verdict}"
                    </p>
                  </div>

                  {/* Pros & Cons */}
                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <h6 style={{ fontWeight: 700, color: "#16a34a", marginBottom: "0.6rem", fontSize: "0.85rem" }}>
                        🟢 What Customers Loved
                      </h6>
                      <ul className="list-unstyled" style={{ fontSize: "0.82rem" }}>
                        {(analysisData.key_pros || []).map((pro, i) => (
                          <li key={i} className="d-flex align-items-start gap-2 mb-2">
                            <span style={{ color: "#16a34a", flexShrink: 0, marginTop: "2px" }}>✓</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="col-12 col-sm-6">
                      <h6 style={{ fontWeight: 700, color: "#dc2626", marginBottom: "0.6rem", fontSize: "0.85rem" }}>
                        🔴 Key Complaints
                      </h6>
                      <ul className="list-unstyled" style={{ fontSize: "0.82rem" }}>
                        {(analysisData.key_cons || []).map((con, i) => (
                          <li key={i} className="d-flex align-items-start gap-2 mb-2">
                            <span style={{ color: "#dc2626", flexShrink: 0, marginTop: "2px" }}>⚠</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Review count info */}
                  {reviewCount === 0 && (
                    <div className="alert alert-info rounded-3 mt-3" style={{ fontSize: "0.8rem" }}>
                      ℹ️ No real reviews yet — this is an AI-generated simulation.
                    </div>
                  )}

                  {/* Re-analyze button */}
                  <button
                    className="btn btn-outline-success btn-sm rounded-pill mt-3"
                    onClick={handleAnalyzeReviews}
                    style={{ fontSize: "0.8rem" }}
                  >
                    🔄 Re-analyze
                  </button>
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="cancel-modal-footer" style={{ borderTop: "1px solid #e5e7eb", padding: "1rem 1.25rem" }}>
              <button
                className="btn btn-secondary w-100 py-2 rounded-pill fw-600"
                onClick={() => setShowAnalyser(false)}
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;