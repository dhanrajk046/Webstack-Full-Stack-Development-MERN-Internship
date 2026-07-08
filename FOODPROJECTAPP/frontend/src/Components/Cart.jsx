import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  removeCartItem,
  updateCartQuantity,
} from "../redux/actions/cartActions";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems = [], restaurant = {}, loading, error } = useSelector(
    (state) => state.cart || {},
  );
  const { isAuthenticated } = useSelector((state) => state.user || {});

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const getFoodItem = (item) => item.foodItem || item;

  const changeQuantity = (item, nextQuantity) => {
    const foodItem = getFoodItem(item);
    const stock = Number(foodItem?.stock || 0);
    const boundedQuantity = Math.max(
      1,
      stock ? Math.min(nextQuantity, stock) : nextQuantity,
    );

    dispatch(updateCartQuantity(foodItem._id, boundedQuantity));
  };

  const removeItem = (item) => {
    const foodItem = getFoodItem(item);
    dispatch(removeCartItem(foodItem._id));
  };

  const subtotal = cartItems.reduce((total, item) => {
    const foodItem = getFoodItem(item);
    return total + Number(foodItem?.price || 0) * Number(item.quantity || 1);
  }, 0);

  if (!isAuthenticated) {
    return (
      <div className="container py-5 text-center">
        <h2>Your cart</h2>
        <p className="text-muted">Please login to view and manage your cart.</p>
        <Link to="/users/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Your Cart</h1>

      {loading && cartItems.length === 0 ? (
        <p>Loading cart...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-5">
          <h4>Your cart is empty</h4>
          <Link to="/" className="btn btn-primary mt-3">
            Browse Restaurants
          </Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            {cartItems.map((item) => {
              const foodItem = getFoodItem(item);
              const stock = Number(foodItem?.stock || 0);
              const quantity = Number(item.quantity || 1);
              const fallbackImage = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="10" fill="%23f3f4f6"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="40">🍲</text></svg>';

              return (
                <div
                  className="cart-item row align-items-center"
                  key={foodItem?._id || item._id}
                >
                  <div className="col-4 col-md-2">
                    <img
                      src={foodItem?.images?.[0]?.url || fallbackImage}
                      alt={foodItem?.name || "Cart item"}
                      className="img-fluid rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackImage;
                      }}
                    />
                  </div>

                  <div className="col-8 col-md-4">
                    <h5 className="mb-1">{foodItem?.name}</h5>
                    <p id="card_item_price" className="mb-0">
                      Rs. {foodItem?.price}
                    </p>
                  </div>

                  <div className="col-7 col-md-4 mt-3 mt-md-0">
                    <div className="stockCounter d-flex align-items-center">
                      <button
                        type="button"
                        className="btn btn-danger minus"
                        disabled={quantity <= 1 || loading}
                        onClick={() => changeQuantity(item, quantity - 1)}
                      >
                        -
                      </button>
                      <input type="number" value={quantity} readOnly />
                      <button
                        type="button"
                        className="btn btn-primary plus"
                        disabled={(stock > 0 && quantity >= stock) || loading}
                        onClick={() => changeQuantity(item, quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col-5 col-md-2 text-end mt-3 mt-md-0">
                    <button
                      type="button"
                      id="delete_cart_item"
                      aria-label={`Remove ${foodItem?.name || "item"}`}
                      disabled={loading}
                      onClick={() => removeItem(item)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="col-lg-4">
            <div id="order_summary">
              <h4>Order Summary</h4>
              {restaurant?.name && (
                <p className="text-muted mb-3">Restaurant: {restaurant.name}</p>
              )}
              <hr />
              <p>
                Items
                <span className="order-summary-values">{cartItems.length}</span>
              </p>
              <p>
                Total
                <span className="order-summary-values">
                  Rs. {subtotal.toFixed(2)}
                </span>
              </p>
              <Link to="/checkout" id="checkout_btn" className="btn btn-primary w-100">
                Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
