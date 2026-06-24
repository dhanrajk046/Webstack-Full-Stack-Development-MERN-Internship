import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  isAuthenticated: false,
  error: null,
  isupdated: false,
  message: null,
  success: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    //login.register, loading
    userRequest: (state) => {
      state.loading = true;
      state.isAuthenticated = false;
    },
    userSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload; // stores user data
    },
    userFail: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },

    //logout
    logoutSuccess: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
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
    },
    updateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateReset: (state) => {
      state.error = null;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
});
export const {
  userRequest,
  userSuccess,
  userFail,
  logoutFail,
  logoutSuccess,
  updateFail,
  updateRequest,
  updateSuccess,
  updateReset,
  clearErrors,
} = userSlice.actions;

export default userSlice.reducer;
