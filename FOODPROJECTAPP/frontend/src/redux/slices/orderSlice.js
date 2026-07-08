import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  order: null,
  orders: [],
  orderDetails: null,
  loading: false,
  listLoading: false,
  detailsLoading: false,
  cancelLoading: false,
  error: null,
  listError: null,
  detailsError: null,
  cancelError: null,
  cancelSuccess: false,
  success: false,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    orderRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    orderSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.order = action.payload;
    },
    orderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    ordersRequest: (state) => {
      state.listLoading = true;
      state.listError = null;
    },
    ordersSuccess: (state, action) => {
      state.listLoading = false;
      state.orders = action.payload;
    },
    ordersFail: (state, action) => {
      state.listLoading = false;
      state.listError = action.payload;
    },
    orderDetailsRequest: (state) => {
      state.detailsLoading = true;
      state.detailsError = null;
    },
    orderDetailsSuccess: (state, action) => {
      state.detailsLoading = false;
      state.orderDetails = action.payload;
    },
    orderDetailsFail: (state, action) => {
      state.detailsLoading = false;
      state.detailsError = action.payload;
    },
    // ── Cancel order states ──
    cancelOrderRequest: (state) => {
      state.cancelLoading = true;
      state.cancelError = null;
      state.cancelSuccess = false;
    },
    cancelOrderSuccess: (state, action) => {
      state.cancelLoading = false;
      state.cancelSuccess = true;
      // Update the order status in the list in-place so UI reflects immediately
      const updated = action.payload;
      state.orders = state.orders.map((o) =>
        o._id === updated._id ? updated : o
      );
      // Also update orderDetails if it's the same order
      if (state.orderDetails && state.orderDetails._id === updated._id) {
        state.orderDetails = updated;
      }
    },
    cancelOrderFail: (state, action) => {
      state.cancelLoading = false;
      state.cancelError = action.payload;
    },
    clearCancelState: (state) => {
      state.cancelLoading = false;
      state.cancelError = null;
      state.cancelSuccess = false;
    },
    clearOrderState: (state) => {
      state.order = null;
      state.orderDetails = null;
      state.error = null;
      state.detailsError = null;
      state.success = false;
    },
  },
});

export const {
  orderRequest,
  orderSuccess,
  orderFail,
  ordersRequest,
  ordersSuccess,
  ordersFail,
  orderDetailsRequest,
  orderDetailsSuccess,
  orderDetailsFail,
  cancelOrderRequest,
  cancelOrderSuccess,
  cancelOrderFail,
  clearCancelState,
  clearOrderState,
} = orderSlice.actions;

export default orderSlice.reducer;
