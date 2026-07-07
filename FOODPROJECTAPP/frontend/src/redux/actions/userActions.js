import api from "../../utils/api";
import {
  userRequest,
  userSuccess,
  userFail,
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  logoutFail,
  logoutSuccess,
  updateRequest,
  updateSuccess,
  updateFail,
} from "../slices/userSlice";
import { clearCart } from "../slices/cartSlice";
import { clearOrderState } from "../slices/orderSlice";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(userRequest());
    const { data } = await api.post("/v1/users/login", { email, password });
    dispatch(userSuccess(data?.data?.user || data?.user));
    return data?.data?.user || data?.user;
  } catch (error) {
    dispatch(userFail(error.response?.data?.message || "Login failed"));
    return null;
  }
};

export const register = (userData) => async (dispatch) => {
  try {
    dispatch(userRequest());
    const payload = {
      ...userData,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      phoneNumber: userData.phoneNumber.trim(),
    };
    const { data } = await api.post("/v1/users/signup", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(userSuccess(data?.data?.user || data?.user));
    return data?.data?.user || data?.user;
  } catch (error) {
    dispatch(userFail(error.response?.data?.message || "Registration failed"));
    return null;
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch(loadUserRequest());
    const { data } = await api.get("/v1/users/me");
    dispatch(loadUserSuccess(data?.data?.user || data?.user));
  } catch (error) {
    dispatch(loadUserFail());
  }
};

export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateRequest());
    const { data } = await api.put("/v1/users/me/update", userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(updateSuccess(data?.data?.user || data?.user || true));
  } catch (error) {
    dispatch(updateFail(error.response?.data?.message || "Update failed"));
  }
};

export const logout = () => async (dispatch) => {
  try {
    await api.get("/v1/users/logout");
    dispatch(logoutSuccess());
    dispatch(clearCart());
    dispatch(clearOrderState());
  } catch (error) {
    dispatch(logoutFail(error.response?.data?.message || "Logout failed"));
  }
};
