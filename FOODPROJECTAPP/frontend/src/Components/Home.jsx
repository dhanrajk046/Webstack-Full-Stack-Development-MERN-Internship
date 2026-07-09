import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  sortByRatings,
  sortByReviews,
  toggleVegOnly,
} from "../redux/slices/restaurantSlice";
import { getRestaurants, createRestaurant } from "../redux/actions/restaurantAction";
import Restaurant from "./Restaurant";
import Fooditem from "./Fooditem";
import Loader from "./layout/Loader";
import Message from "./Message";
import CountRestaurant from "./CountRestaurant";
import api from "../utils/api";

const Home = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams();

  const {
    loading: restaurantsLoading,
    error: restaurantsError,
    restaurants,
    showVegOnly,
  } = useSelector((state) => state.restaurants);

  const { isAuthenticated } = useSelector((state) => state.user || {});

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // Add Restaurant Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [addRestaurantError, setAddRestaurantError] = useState("");
  const [addRestaurantLoading, setAddRestaurantLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    isVeg: false,
    ratings: 4.0,
    imageUrl: ""
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddRestaurantSubmit = async (e) => {
    e.preventDefault();
    setAddRestaurantLoading(true);
    setAddRestaurantError("");
    try {
      const finalImageUrl = formData.imageUrl.trim() || `https://image.pollinations.ai/prompt/${encodeURIComponent(formData.name + " restaurant front design modern 4k")}?width=600&height=400&nologo=true`;
      
      const payload = {
        name: formData.name,
        address: formData.address,
        isVeg: formData.isVeg,
        ratings: Number(formData.ratings) || 4.0,
        images: [{
          public_id: `restaurant_dyn_${Date.now()}`,
          url: finalImageUrl
        }]
      };

      await dispatch(createRestaurant(payload));
      
      setFormData({
        name: "",
        address: "",
        isVeg: false,
        ratings: 4.0,
        imageUrl: ""
      });
      setShowAddModal(false);
      dispatch(getRestaurants(keyword));
    } catch (err) {
      setAddRestaurantError(err.response?.data?.message || err.message || "Failed to create restaurant.");
    } finally {
      setAddRestaurantLoading(false);
    }
  };

  useEffect(() => {
    if (restaurantsError) return;
    dispatch(getRestaurants(keyword));
  }, [dispatch, restaurantsError, keyword]);

  // Fetch matching food items (products) if a keyword search is active
  useEffect(() => {
    if (keyword) {
      setProductsLoading(true);
      api
        .get(`/v1/eats/items/search?keyword=${keyword}`)
        .then(({ data }) => {
          if (data?.status === "success" || data?.success) {
            setProducts(data.data || []);
          } else {
            setProducts([]);
          }
        })
        .catch((err) => {
          console.error("Failed to load matching food items:", err);
          setProducts([]);
        })
        .finally(() => setProductsLoading(false));
    } else {
      setProducts([]);
    }
  }, [keyword]);

  const visibleRestaurants = showVegOnly
    ? restaurants?.filter((r) => r.isVeg)
    : restaurants;

  // Filter matched products based on veg filter as well if user selects "Pure Veg"
  const visibleProducts = showVegOnly
    ? products?.filter((item) => item.restaurant?.isVeg || item.isVeg)
    : products;

  return (
    <>
      <CountRestaurant />

      <div className="content-container" style={{ paddingTop: "1.25rem", paddingBottom: "3rem" }}>
        {restaurantsLoading ? (
          <Loader />
        ) : restaurantsError ? (
          <Message variant="danger">{restaurantsError}</Message>
        ) : (
          <>
            {/* Sort / Filter Bar */}
            <div className="sort-bar">
              <span className="text-muted me-auto" style={{ fontSize: "0.85rem" }}>
                {visibleRestaurants?.length || 0} restaurants found
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

              {isAuthenticated ? (
                <button
                  className="sort-btn ms-2"
                  id="add-restaurant-btn"
                  onClick={() => setShowAddModal(true)}
                  style={{
                    background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                    border: "1.5px solid #86efac",
                    color: "var(--brand-green)",
                    fontWeight: "600"
                  }}
                >
                  ➕ Add Restaurant
                </button>
              ) : (
                <Link
                  to="/users/login"
                  className="sort-btn ms-2 text-decoration-none"
                  style={{
                    background: "#f3f4f6",
                    color: "#4b5563"
                  }}
                >
                  🔒 Login to Add Restaurant
                </Link>
              )}
            </div>

            {/* Keyword Search Products Section */}
            {keyword && (
              <div className="mb-5">
                <div className="d-flex align-items-center mb-3">
                  <h2 className="menu-category-title mb-0" style={{ fontSize: "1.3rem", fontWeight: 700 }}>
                    Matching Menu Items & Products
                  </h2>
                  <span className="text-muted ms-2" style={{ fontSize: "0.85rem" }}>
                    ({visibleProducts?.length || 0} items)
                  </span>
                </div>

                {productsLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-success spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading matching items...</span>
                    </div>
                  </div>
                ) : visibleProducts?.length > 0 ? (
                  <div className="row g-3">
                    {visibleProducts.map((item) => (
                      <Fooditem
                        key={item._id}
                        fooditem={item}
                        restaurant={item.restaurant?._id || item.restaurant}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted small">No specific food items match this keyword.</p>
                )}
                <hr className="my-4" />
              </div>
            )}

            {/* Restaurants Section Heading */}
            {keyword && (
              <h2 className="menu-category-title mb-3" style={{ fontSize: "1.3rem", fontWeight: 700 }}>
                Matching Restaurants
              </h2>
            )}

            {/* Restaurant List */}
            <div className="row g-0">
              {visibleRestaurants?.length > 0 ? (
                visibleRestaurants.map((restaurant) => (
                  <Restaurant key={restaurant._id} restaurant={restaurant} />
                ))
              ) : (
                <div className="col-12">
                  <div className="empty-state py-5 text-center">
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

      {/* ── ADD NEW RESTAURANT MODAL ── */}
      {showAddModal && (
        <div className="cancel-modal-overlay" style={{ zIndex: 1050 }} onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}>
          <div className="cancel-modal-box" style={{ maxWidth: "520px", width: "calc(100% - 2rem)" }}>
            <div className="cancel-modal-header" style={{ background: "linear-gradient(135deg, #f9fafb, #f3f4f6)", borderBottom: "1px solid #e5e7eb" }}>
              <div className="cancel-modal-icon" style={{ fontSize: "2rem" }}>🏪</div>
              <h2 className="cancel-modal-title" style={{ color: "var(--text-dark)" }}>Add Restaurant</h2>
              <p className="cancel-modal-subtitle">Register a new food joint in the application</p>
            </div>

            <form onSubmit={handleAddRestaurantSubmit}>
              <div className="cancel-modal-body" style={{ maxHeight: "65vh", overflowY: "auto", padding: "1.25rem" }}>
                {addRestaurantError && <div className="alert alert-danger py-2" role="alert">{addRestaurantError}</div>}

                {/* Name */}
                <div className="mb-3">
                  <label htmlFor="restaurant_name" className="form-label fw-600">Restaurant Name</label>
                  <input id="restaurant_name" name="name" className="form-control" placeholder="e.g. Domino's Pizza" value={formData.name} onChange={handleInputChange} required />
                </div>

                {/* Address */}
                <div className="mb-3">
                  <label htmlFor="restaurant_address" className="form-label fw-600">Address</label>
                  <input id="restaurant_address" name="address" className="form-control" placeholder="e.g. MG Road, Bangalore" value={formData.address} onChange={handleInputChange} required />
                </div>

                {/* Ratings (optional, defaults to 4) */}
                <div className="mb-3">
                  <label htmlFor="restaurant_ratings" className="form-label fw-600">Base Rating (0 - 5)</label>
                  <input id="restaurant_ratings" name="ratings" type="number" min="0" max="5" step="0.1" className="form-control" value={formData.ratings} onChange={handleInputChange} />
                </div>

                {/* Custom Image URL (optional) */}
                <div className="mb-3">
                  <label htmlFor="restaurant_image" className="form-label fw-600">Image URL (Optional)</label>
                  <input id="restaurant_image" name="imageUrl" className="form-control" placeholder="Paste image link or leave blank for AI image" value={formData.imageUrl} onChange={handleInputChange} />
                  <small className="text-muted">If left blank, an AI-generated image matching the name will be used.</small>
                </div>

                {/* Pure Veg Checkbox */}
                <div className="mb-3 border rounded p-3 bg-light">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="restaurant_isVeg" name="isVeg" checked={formData.isVeg} onChange={handleInputChange} />
                    <label className="form-check-label fw-600 ms-2" htmlFor="restaurant_isVeg">
                      This is a Pure Veg restaurant 🥗
                    </label>
                  </div>
                </div>
              </div>

              <div className="cancel-modal-footer d-flex gap-2 justify-content-end p-3" style={{ background: "#f9fafb", borderTop: "1px solid #e5e7eb" }}>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAddModal(false)} style={{ borderRadius: "20px" }}>Cancel</button>
                <button type="submit" className="btn btn-success" disabled={addRestaurantLoading} style={{ borderRadius: "20px", background: "var(--brand-green)", border: "none" }}>
                  {addRestaurantLoading ? "Creating..." : "Save Restaurant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;