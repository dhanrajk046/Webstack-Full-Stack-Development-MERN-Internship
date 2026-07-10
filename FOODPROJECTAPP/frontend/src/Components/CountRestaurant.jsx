import React from "react";
import { useSelector } from "react-redux";
import "./css/count.css";

const CountRestaurant = () => {
  const { count, showVegOnly, loading, error, restaurants } = useSelector(
    (state) => state.restaurants,
  );

  const vegCount = Array.isArray(restaurants)
    ? restaurants.filter((r) => r.isVeg).length
    : 0;

  const displayCount = showVegOnly ? vegCount : count;
  const label = displayCount === 1 ? "restaurant" : "restaurants";

  return (
    <div className="count-banner">
      <div className="content-container">
        {error ? (
          <p className="mb-0 text-warning">{error}</p>
        ) : (
          <>
            <h1 className="NumOfRestro">
              {loading ? "--" : displayCount}
              <span className="Restro"> {label} available</span>
            </h1>
            <p className="mb-0 mt-1" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem" }}>
              {loading ? "Fetching restaurants..." : (showVegOnly ? "Showing pure vegetarian only" : "Your wish is our command. Order fresh, delivered fast")}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CountRestaurant;
