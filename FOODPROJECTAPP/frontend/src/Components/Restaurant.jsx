import React, { useState } from "react";
import { Link } from "react-router-dom";

const Restaurant = ({ restaurant }) => {
  const [showAI, setShowAI] = useState(false);

  return (
    <div className="col-12 my-2">
      <div className="restaurant-card">

        {/* Thumbnail */}
        <Link to={`/eats/stores/${restaurant._id}/menus`} className="d-block flex-shrink-0">
          <img
            className="restaurant-image"
            src={restaurant.images?.[0]?.url || "/images/placeholder.png"}
            alt={restaurant.name}
            loading="lazy"
          />
        </Link>

        {/* Info */}
        <div className="restaurant-info">
          <Link to={`/eats/stores/${restaurant._id}/menus`} style={{ textDecoration: "none", color: "inherit" }}>
            <h4>{restaurant.name}</h4>
          </Link>

          <p className="rest_address">{restaurant.address}</p>

          {/* Ratings */}
          <div className="d-flex align-items-center gap-2 mb-1">
            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{ width: `${(restaurant.ratings / 5) * 100}%` }}
              />
            </div>
            <span className="text-muted" style={{ fontSize: "0.78rem" }}>
              ({restaurant.numOfReviews} reviews)
            </span>
          </div>

          {/* AI Summary toggle */}
          {restaurant.reviewSentiment && (
            <button
              className="ai-btn"
              onClick={() => setShowAI(!showAI)}
              aria-expanded={showAI}
            >
              {showAI ? "➖ Hide Summary" : "💬 View Review Summary"}
            </button>
          )}

          {/* AI Insights */}
          {showAI && (
            <div className="ai-insights-box mt-2">
              <div className="ai-status">
                😊 <strong>{restaurant.reviewSentiment}</strong>
              </div>
              {(restaurant.reviewSummaryBullets || []).length > 0 && (
                <ul className="mb-2 ps-3" style={{ fontSize: "0.82rem" }}>
                  {restaurant.reviewSummaryBullets.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              )}
              <div className="mentions">
                {(restaurant.reviewTopMentions || []).map((item, i) => (
                  <span key={i} className="mention-tag">#{item}</span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Restaurant;