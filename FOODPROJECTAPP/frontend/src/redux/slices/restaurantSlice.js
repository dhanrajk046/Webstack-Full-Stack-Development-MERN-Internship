import { createSlice } from "@reduxjs/toolkit";

// 1. Define the initial state (This fixes the red 'x' error)
const initialState = {
  restaurants: [],
  loading: false,
  error: null, // Named 'error' to match Home.jsx
  count: 0,
  showVegOnly: false,
};

// 2. Create the slice
const restaurantSlice = createSlice({
  name: "restaurants",
  initialState, // This now references the object above
  reducers: {
    // ---- GET RESTAURANTS ----
    getRestaurantsRequest: (state) => {
      state.loading = true;
    },
    getRestaurantsSuccess: (state, action) => {
      state.loading = false;
      state.restaurants = action.payload.restaurants;
      state.count = action.payload.count;
    },
    getRestaurantFail: (state, action) => {
      state.loading = false;
      state.error = action.payload; 
    },

    // ---- CREATE RESTAURANT ----
    createRestaurantRequest: (state) => {
      state.loading = true;
    },
    createRestaurantSuccess: (state, action) => {
      state.loading = false;
      // If you want to add the new restaurant immediately to the screen:
      // state.restaurants.push(action.payload);
    },
    createRestaurantFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ---- DELETE RESTAURANT ----
    deleteRestaurantRequest: (state) => {
      state.loading = true;
    },
    deleteRestaurantSuccess: (state, action) => {
      state.loading = false;
      // Filter out the deleted restaurant immediately from the screen:
      // state.restaurants = state.restaurants.filter(res => res._id !== action.payload);
    },
    deleteRestaurantFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ---- SORTING AND FILTERING ----
    sortByRatings: (state) => {
      state.restaurants.sort((a, b) => b.ratings - a.ratings);
    },
    sortByReviews: (state) => {
      state.restaurants.sort((a, b) => b.numOfReviews - a.numOfReviews);
    },
    toggleVegOnly: (state) => {
      state.showVegOnly = !state.showVegOnly;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

// 3. Export all the actions so you can use them in Home.jsx and restaurantAction.js
export const {
  getRestaurantsRequest,
  getRestaurantsSuccess,
  getRestaurantFail,
  createRestaurantRequest,
  createRestaurantSuccess,
  createRestaurantFail,
  deleteRestaurantRequest,
  deleteRestaurantSuccess,
  deleteRestaurantFail,
  sortByRatings,
  sortByReviews,
  toggleVegOnly, 
  clearError,
} = restaurantSlice.actions;

// 4. Export the reducer to be added to your Redux store
export default restaurantSlice.reducer;