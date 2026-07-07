import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getMenus } from "../redux/actions/menuActions";
import Fooditem from "./Fooditem";

const Menu = () => {
  const { id: restaurantId } = useParams();
  const dispatch = useDispatch();
  const { menus = [], loading, error } = useSelector(
    (state) => state.menus || {},
  );

  // Fetch menu on mount or when restaurantId changes
  useEffect(() => {
    if (restaurantId) {
      dispatch(getMenus(restaurantId));
    }
  }, [dispatch, restaurantId]);

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
              <h2 className="menu-category-title">{menu.category}</h2>
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
    </div>
  );
};

export default Menu;