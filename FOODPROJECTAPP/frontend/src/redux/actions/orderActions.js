import api from "../../utils/api";
import {
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
} from "../slices/orderSlice";
import { clearCart } from "../slices/cartSlice";

// ==========================================
// 1. PLACE NEW ORDER
// ==========================================
export const placeOrder = (deliveryInfo) => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await api.post("/v1/eats/orders/place-order", {
      deliveryInfo,
    });

    dispatch(orderSuccess(data?.order));
    dispatch(clearCart());
    return data?.order;

  } catch (error) {
    dispatch(
      orderFail(error.response?.data?.message || "Unable to place order. Please try again.")
    );
    return null;
  }
};

// ==========================================
// 2. FETCH ALL ORDERS FOR LOGGED IN USER
// ==========================================
export const fetchMyOrders = () => async (dispatch) => {
  try {
    dispatch(ordersRequest());

    const { data } = await api.get("/v1/eats/orders/me/myOrders");

    dispatch(ordersSuccess(data?.orders || []));

  } catch (error) {
    dispatch(
      ordersFail(error.response?.data?.message || "Unable to load your orders.")
    );
  }
};

// ==========================================
// 3. FETCH SINGLE ORDER DETAILS
// ==========================================
export const fetchOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch(orderDetailsRequest());

    const { data } = await api.get(`/v1/eats/orders/${id}`);

    dispatch(orderDetailsSuccess(data?.order));

  } catch (error) {
    dispatch(
      orderDetailsFail(error.response?.data?.message || "Unable to find order details.")
    );
  }
};

// ==========================================
// 4. CANCEL ORDER (within 3 days)
// ==========================================
export const cancelOrder = (id, reason = "Cancelled by user") => async (dispatch) => {
  try {
    dispatch(cancelOrderRequest());

    const { data } = await api.patch(`/v1/eats/orders/${id}/cancel`, { reason });

    dispatch(cancelOrderSuccess(data?.order));
    return { success: true, message: data?.message };

  } catch (error) {
    const message = error.response?.data?.message || "Unable to cancel order. Please try again.";
    dispatch(cancelOrderFail(message));
    return { success: false, message };
  }
};