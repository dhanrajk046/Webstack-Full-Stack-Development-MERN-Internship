import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  order: null,
  orders: [],
  orderDetails: null,
  loading: false,
  listLoading: false,
  detailsLoading: false,
  error: null,
  listError: null,
  detailsError: null,
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
  clearOrderState,
} = orderSlice.actions;

export default orderSlice.reducer;
