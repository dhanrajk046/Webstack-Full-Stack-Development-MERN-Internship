import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  isAuthenticated: false,
  error: null,
  isupdated: false,
  message: null,
  success: null,
  authChecked: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    //login.register, loading
    userRequest: (state) => {
      state.loading = true;
      state.isAuthenticated = false;
      state.error = null;
    },
    userSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload; // stores user data
      state.error = null;
      state.authChecked = true;
    },
    userFail: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
      state.authChecked = true;
    },
    loadUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loadUserSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.authChecked = true;
    },
    loadUserFail: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.authChecked = true;
    },

    //logout
    logoutSuccess: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.authChecked = true;
    },
    logoutFail: (state, action) => {
      state.error = action.payload;
    },

    //update profile/password
    updateRequest: (state) => {
      state.loading = true;
    },
    updateSuccess: (state, action) => {
      state.loading = false;
      state.isupdated = action.payload;
      if (action.payload && typeof action.payload === "object") {
        state.user = action.payload;
      }
    },
    updateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateReset: (state) => {
      state.isupdated = false;
      state.error = null;
    },
    forgotPasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    forgotPasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    forgotPasswordFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetPasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    },
    resetPasswordSuccess: (state, action) => {
      state.loading = false;
      state.success = action.payload;
    },
    resetPasswordFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
      state.message = null;
      state.success = null;
    },
  },
});

export const {
  userRequest,
  userSuccess,
  userFail,
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  logoutFail,
  logoutSuccess,
  updateFail,
  updateRequest,
  updateSuccess,
  updateReset,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFail,
  clearErrors,
} = userSlice.actions;

export default userSlice.reducer;
