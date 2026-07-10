import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const Restaurant = ({ restaurant, isSkeleton }) => {
  if (isSkeleton) {
    return (
      <div className="col-12 my-2">
        <div className="restaurant-card skeleton-card">
          {/* Thumbnail Placeholder */}
          <div className="restaurant-image skeleton-image skeleton-shimmer"></div>

          {/* Info Placeholders */}
          <div className="restaurant-info">
            <div className="skeleton-title skeleton-line skeleton-shimmer"></div>
            <div className="skeleton-address skeleton-line skeleton-shimmer"></div>
            <div className="skeleton-rating skeleton-line skeleton-shimmer"></div>
            <div className="skeleton-btn skeleton-line skeleton-shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  const [showAI, setShowAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [error, setError] = useState("");

  const handleToggleSummary = async () => {
    if (showAI) {
      setShowAI(false);
      return;
    }
    setShowAI(true);
    if (aiData || error) return; // already loaded or failed once

    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/v1/ai/analyze-reviews", {
        name: restaurant.name,
        reviews: restaurant.reviews || [],
      });
      if (data?.success) {
        setAiData(data.analysis);
      } else {
        setError("Unable to generate summary.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load summary.");
    } finally {
      setLoading(false);
    }
  };

  const getSentimentEmoji = (sentiment) => {
    const s = (sentiment || "").toLowerCase();
    if (s.includes("positive")) return "😊";
    if (s.includes("negative")) return "⚠️";
    return "😐";
  };

  const reviewCount = restaurant.reviews?.length || restaurant.numOfReviews || 0;

  return (
    <div className="col-12 my-2">
      <div className="restaurant-card">
        {/* Thumbnail */}
        <Link to={`/eats/stores/${restaurant._id}/menus`} className="d-block flex-shrink-0">
          <img
            className="restaurant-image"
            src={restaurant.images?.[0]?.url || "/images/placeholder.png"}
            alt={restaurant.name}
          />
        </Link>

        {/* Info */}
        <div className="restaurant-info">
          <Link to={`/eats/stores/${restaurant._id}/menus`} style={{ textDecoration: "none", color: "inherit" }}>
            <h4 className="mb-1" style={{ fontWeight: 700 }}>{restaurant.name}</h4>
          </Link>

          <p className="rest_address mb-2">📍 {restaurant.address || "Address not available"}</p>

          {/* Ratings */}
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{ width: `${(restaurant.ratings / 5) * 100}%` }}
              />
            </div>
            <span className="text-muted" style={{ fontSize: "0.8rem" }}>
              ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
            </span>
          </div>

          {/* AI Summary toggle — show for any restaurant with reviews */}
          <button
            className="ai-btn mt-2 border rounded-pill px-3 py-1 fw-600"
            id={`ai-summary-btn-${restaurant._id}`}
            onClick={handleToggleSummary}
            aria-expanded={showAI}
            style={{
              fontSize: "0.75rem",
              background: showAI ? "var(--brand-green)" : "var(--bg-green-faint)",
              color: showAI ? "#fff" : "var(--brand-green)",
              borderColor: "var(--brand-green)",
              cursor: "pointer",
              transition: "all 0.15s ease-in-out"
            }}
          >
            {showAI ? "➖ Hide Review Summary" : "✨ View Review Summary"}
          </button>

          {/* AI Insights */}
          {showAI && (
            <div className="ai-insights-box mt-2 p-3 rounded border-start border-4" style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderLeftColor: "var(--brand-green)",
              fontSize: "0.8rem"
            }}>
              {loading ? (
                <div className="d-flex align-items-center gap-2 text-muted">
                  <span className="spinner-border spinner-border-sm text-success" role="status" aria-hidden="true"></span>
                  <span>Genie is analyzing reviews...</span>
                </div>
              ) : error ? (
                <div className="text-danger small">{error}</div>
              ) : aiData ? (
                <div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="badge bg-success" style={{ fontSize: "0.72rem" }}>
                      {getSentimentEmoji(aiData.sentiment)} Sentiment: {aiData.sentiment}
                    </span>
                  </div>
                  
                  <p className="mb-2 text-dark font-italic" style={{ lineHeight: 1.4, fontStyle: "italic" }}>
                    "{aiData.ai_verdict}"
                  </p>

                  <div className="row g-2 mt-1">
                    <div className="col-sm-6">
                      <strong className="text-success d-block mb-1 small" style={{ fontWeight: 700 }}>🟢 Loved:</strong>
                      <ul className="list-unstyled mb-0 ps-0" style={{ fontSize: "0.75rem" }}>
                        {(aiData.key_pros || []).map((pro, i) => (
                          <li key={i} className="mb-1 d-flex align-items-start gap-1">
                            <span className="text-success">✓</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-sm-6">
                      <strong className="text-danger d-block mb-1 small" style={{ fontWeight: 700 }}>🔴 Complaints:</strong>
                      <ul className="list-unstyled mb-0 ps-0" style={{ fontSize: "0.75rem" }}>
                        {(aiData.key_cons || []).map((con, i) => (
                          <li key={i} className="mb-1 d-flex align-items-start gap-1">
                            <span className="text-danger">⚠</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-muted small">No reviews available to analyze.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurant;