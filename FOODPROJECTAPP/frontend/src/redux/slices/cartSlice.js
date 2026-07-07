//store cart items
// track restaurant info
//handleloading errors
//update cart when user adds/remove items
//store delivery details

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  restaurant: {},
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    cartRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    cartSuccess: (state, action) => {
      state.loading = false;
      const payload = action.payload || {};
      const cart = payload.cart || payload;
      state.cartItems = Array.isArray(cart?.items)
        ? cart.items
        : Array.isArray(cart?.cartItems)
          ? cart.cartItems
          : [];
      state.restaurant = cart?.restaurant || payload?.restaurant || {};
    },
    cartFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateCartSuccess: (state, action) => {
      state.loading = false;
      const payload = action.payload || {};
      const cart = payload.cart || payload;
      state.cartItems = Array.isArray(cart?.items)
        ? cart.items
        : Array.isArray(cart?.cartItems)
          ? cart.cartItems
          : [];
      state.restaurant = cart?.restaurant || payload?.restaurant || {};
    },
    removeCartItem: (state, action) => {
      state.cartItems = action.payload?.cart?.items || [];
    },
    clearCart(state) {
      state.cartItems = [];
    },
    clearErrors: (state) => {
      state.error = null;
    },
    saveDeliveryInfo: (state, action) => {
      state.deliveryInfo = action.payload;
    },
  },
});

export const {
  cartRequest,
  cartSuccess,
  cartFail,
  updateCartSuccess,
  removeCartItem,
  clearCart,
  clearErrors,
  saveDeliveryInfo,
} = cartSlice.actions;

export default cartSlice.reducer;
