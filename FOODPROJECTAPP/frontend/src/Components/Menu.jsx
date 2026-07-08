import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getMenus } from "../redux/actions/menuActions";
import Fooditem from "./Fooditem";
import api from "../utils/api";

const Menu = () => {
  const { id: restaurantId } = useParams();
  const dispatch = useDispatch();
  const { menus = [], loading, error } = useSelector(
    (state) => state.menus || {},
  );

  // AI Analyser state
  const [showAnalyser, setShowAnalyser] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState(null);

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
        .catch(err => console.error("Failed to load restaurant details:", err));
    }
  }, [dispatch, restaurantId]);

  const handleAnalyzeReviews = async () => {
    if (!restaurantInfo) return;
    setAnalysisLoading(true);
    setAnalysisError(null);
    try {
      const { data } = await api.post("/v1/ai/analyze-reviews", {
        name: restaurantInfo.name,
        reviews: restaurantInfo.reviews || [],
      });
      if (data?.success) {
        setAnalysisData(data.analysis);
      } else {
        setAnalysisError("Could not generate analysis.");
      }
    } catch (err) {
      setAnalysisError(err.response?.data?.message || err.message || "Failed to analyze reviews.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  useEffect(() => {
    if (showAnalyser && !analysisData && !analysisLoading) {
      handleAnalyzeReviews();
    }
  }, [showAnalyser]);

  const getSentimentBadgeColor = (sentiment) => {
    const s = (sentiment || "").toLowerCase();
    if (s.includes("positive")) return "bg-success";
    if (s.includes("negative")) return "bg-danger";
    return "bg-warning text-dark";
  };

  return (
    <div className="content-container" style={{ paddingTop: "2rem", paddingBottom: "3rem" }}>
      {/* Back link */}
      <Link
        to="/"
        className="d-inline-flex align-items-center gap-1 mb-3 fw-500"
        style={{ fontSize: "0.9rem", color: "var(--brand-green)" }}
      >
        <i className="fa fa-arrow-left" aria-hidden="true"></i>
        &nbsp;All Restaurants
      </Link>

      {/* Restaurant Header & AI Review Analyser Button */}
      {restaurantInfo && (
        <div className="restaurant-header-card bg-white rounded shadow-sm p-4 mb-4" style={{ borderLeft: "4px solid var(--brand-green)" }}>
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h1 className="restaurant-title mb-1" style={{ fontSize: "1.75rem", fontWeight: 800 }}>{restaurantInfo.name}</h1>
              <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>📍 {restaurantInfo.address}</p>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success" style={{ fontSize: "0.85rem" }}>{restaurantInfo.ratings} ★</span>
                <span className="text-muted small">({restaurantInfo.numOfReviews || restaurantInfo.reviews?.length || 0} reviews)</span>
              </div>
            </div>
            {restaurantInfo.reviews?.length > 0 && (
              <button
                className="btn btn-outline-success d-flex align-items-center gap-2 py-2 px-3 fw-600 rounded-pill shadow-sm"
                onClick={() => setShowAnalyser(true)}
                style={{ fontSize: "0.9rem", transition: "all 0.2s" }}
              >
                🪄 <span>AI Review Analyser</span>
              </button>
            )}
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
        <div className="empty-state py-5">
          <div className="mb-3" style={{ fontSize: "3rem" }}>🍽️</div>
          <h4>No menu items yet</h4>
          <p className="text-muted">Check back soon!</p>
        </div>
      ) : (
        menus.map((menu) => (
          <div key={menu._id} className="mb-5">
            {/* Category header */}
            <div className="d-flex align-items-center mb-3">
              <h2 className="menu-category-title" style={{ fontSize: "1.3rem", fontWeight: 700 }}>{menu.category}</h2>
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

      {/* AI REVIEW ANALYSER MODAL */}
      {showAnalyser && restaurantInfo && (
        <div className="cancel-modal-overlay" style={{ zIndex: 1050 }} onClick={(e) => { if (e.target === e.currentTarget) setShowAnalyser(false); }}>
          <div className="cancel-modal-box" style={{ maxWidth: "550px" }}>
            <div className="cancel-modal-header" style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", borderBottom: "1px solid #bbf7d0" }}>
              <div className="cancel-modal-icon">🪄</div>
              <h2 className="cancel-modal-title" style={{ color: "var(--brand-green)" }}>AI Review Analyser</h2>
              <p className="cancel-modal-subtitle">Genie's feedback analysis for <strong>{restaurantInfo.name}</strong></p>
            </div>

            <div className="cancel-modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
              {analysisLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-success mb-3" role="status">
                    <span className="visually-hidden">Analyzing...</span>
                  </div>
                  <h5>Genie is reading and summarizing reviews...</h5>
                  <p className="text-muted small">This will take just a few seconds.</p>
                </div>
              ) : analysisError ? (
                <div className="alert alert-danger">{analysisError}</div>
              ) : analysisData ? (
                <div>
                  {/* Sentiment */}
                  <div className="d-flex align-items-center justify-content-between mb-4 bg-light p-3 rounded">
                    <span className="fw-600">Overall Customer Sentiment</span>
                    <span className={`badge ${getSentimentBadgeColor(analysisData.sentiment)} px-3 py-2`} style={{ fontSize: "0.9rem", fontWeight: 700 }}>
                      {analysisData.sentiment}
                    </span>
                  </div>

                  {/* Verdict */}
                  <div className="mb-4">
                    <h5 className="fw-700" style={{ fontSize: "1rem" }}>💡 Genie's AI Verdict</h5>
                    <p className="p-3 bg-light rounded border-start border-success border-4" style={{ fontSize: "0.9rem", lineHeight: 1.6, fontStyle: "italic", background: "#f9fafb" }}>
                      "{analysisData.ai_verdict}"
                    </p>
                  </div>

                  {/* Pros & Cons */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <h6 className="fw-700 text-success mb-2">🟢 What Customers Loved</h6>
                      <ul className="list-unstyled small">
                        {analysisData.key_pros?.map((pro, i) => (
                          <li key={i} className="mb-2 d-flex align-items-start gap-1">
                            <span className="text-success">✓</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="col-md-6 mb-3">
                      <h6 className="fw-700 text-danger mb-2">🔴 Key Complaints</h6>
                      <ul className="list-unstyled small">
                        {analysisData.key_cons?.map((con, i) => (
                          <li key={i} className="mb-2 d-flex align-items-start gap-1">
                            <span className="text-danger">⚠️</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted">No reviews to analyze.</p>
              )}
            </div>

            <div className="cancel-modal-footer" style={{ borderTop: "1px solid #e5e7eb" }}>
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