import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  sortByRatings,
  sortByReviews,
  toggleVegOnly,
} from "../redux/slices/restaurantSlice";
import { getRestaurants } from "../redux/actions/restaurantAction";
import Restaurant from "./Restaurant";
import Loader from "./layout/Loader";
import Message from "./Message";
import CountRestaurant from "./CountRestaurant";

const Home = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams();

  const {
    loading: restaurantsLoading,
    error: restaurantsError,
    restaurants,
    showVegOnly,
  } = useSelector((state) => state.restaurants);

  useEffect(() => {
    if (restaurantsError) return;
    dispatch(getRestaurants(keyword));
  }, [dispatch, restaurantsError, keyword]);

  const visibleRestaurants = showVegOnly
    ? restaurants?.filter((r) => r.isVeg)
    : restaurants;

  return (
    <>
      <CountRestaurant />

      <div className="content-container" style={{ paddingTop: "1.25rem", paddingBottom: "2rem" }}>
        {restaurantsLoading ? (
          <Loader />
        ) : restaurantsError ? (
          <Message variant="danger">{restaurantsError}</Message>
        ) : (
          <>
            {/* Sort / Filter Bar */}
            <div className="sort-bar">
              <span className="text-muted me-auto" style={{ fontSize: "0.85rem" }}>
                {visibleRestaurants?.length || 0} results
              </span>
              <button
                className={`sort-btn${showVegOnly ? " active" : ""}`}
                onClick={() => dispatch(toggleVegOnly())}
              >
                🥗 {showVegOnly ? "All" : "Pure Veg"}
              </button>
              <button
                className="sort-btn"
                onClick={() => dispatch(sortByReviews())}
              >
                📝 Reviews
              </button>
              <button
                className="sort-btn"
                onClick={() => dispatch(sortByRatings())}
              >
                ⭐ Ratings
              </button>
            </div>

            {/* Restaurant List */}
            <div className="row g-0">
              {visibleRestaurants?.length > 0 ? (
                visibleRestaurants.map((restaurant) => (
                  <Restaurant key={restaurant._id} restaurant={restaurant} />
                ))
              ) : (
                <div className="col-12">
                  <div className="empty-state py-5">
                    <div className="empty-icon mb-3" style={{ fontSize: "3rem" }}>🍽️</div>
                    <h4>No restaurants found</h4>
                    <p className="text-muted">Try a different search or remove filters.</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Home;