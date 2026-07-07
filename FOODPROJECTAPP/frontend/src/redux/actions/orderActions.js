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
} from "../slices/orderSlice";
import { clearCart } from "../slices/cartSlice";

// ==========================================
// 1. PLACE NEW ORDER
// ==========================================
export const placeOrder = (deliveryInfo) => async (dispatch) => {
  try {
    dispatch(orderRequest());

    // 💡 Note: Make sure your Express backend expects req.body.deliveryInfo
    // If it expects flat properties, you might need to spread it instead: { ...deliveryInfo }
    const { data } = await api.post("/v1/eats/orders/place-order", {
      deliveryInfo, 
    });

    // Save to Redux state
    dispatch(orderSuccess(data?.order));
    
    // Empty the user's cart after a successful order
    dispatch(clearCart());
    
    // Return the order data so Checkout.jsx can navigate using the new _id
    return data?.order; 

  } catch (error) {
    dispatch(
      orderFail(error.response?.data?.message || "Unable to place order. Please try again.")
    );
    // Return null so the UI doesn't crash when trying to navigate
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

    // Default to an empty array if backend returns nothing
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

    // Grabs 'data.order' to perfectly match the JSON from your backend
    dispatch(orderDetailsSuccess(data?.order)); 

  } catch (error) {
    dispatch(
      orderDetailsFail(error.response?.data?.message || "Unable to find order details.")
    );
  }
};