import api from "../../utils/api";
import {
  cartRequest,
  cartSuccess,
  cartFail,
  updateCartSuccess,
} from "../slices/cartSlice";

export const fetchCart = () => async (dispatch) => {
  try {
    dispatch(cartRequest());
    const { data } = await api.get("/v1/eats/cart/get-cart");
    dispatch(cartSuccess(data?.data || data?.cart || data));
  } catch (error) {
    dispatch(cartFail(error.response?.data?.message || error.message));
  }
};

export const addItemToCart =
  (foodItemId, restaurantId, quantity) => async (dispatch) => {
    try {
      dispatch(cartRequest());
      const { data } = await api.post("/v1/eats/cart/add-to-cart", {
        foodItemId,
        restaurantId,
        quantity,
      });
      dispatch(cartSuccess(data?.data || data?.cart || data));
    } catch (error) {
      dispatch(
        cartFail(error.response?.data?.message || "Unable to add item to cart"),
      );
    }
  };

export const updateCartQuantity =
  (foodItemId, quantity) => async (dispatch) => {
    try {
      dispatch(cartRequest());
      const { data } = await api.post("/v1/eats/cart/update-cart-item", {
        foodItemId,
        quantity,
      });
      dispatch(updateCartSuccess(data?.data || data?.cart || data));
    } catch (error) {
      dispatch(
        cartFail(error.response?.data?.message || "Unable to update cart"),
      );
    }
  };

export const removeCartItem = (foodItemId) => async (dispatch) => {
  try {
    dispatch(cartRequest());
    const { data } = await api.delete("/v1/eats/cart/delete-cart-item", {
      data: {
        foodItemId,
      },
    });
    dispatch(cartSuccess(data?.data || data?.cart || data));
  } catch (error) {
    dispatch(
      cartFail(error.response?.data?.message || "Unable to remove item"),
    );
  }
};
