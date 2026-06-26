// import api from "../../utils/api"; // Make sure this points to your actual api/axios file

// import {
//   getRestaurantsRequest,
//   getRestaurantsSuccess,
//   getRestaurantFail,
//   createRestaurantRequest,
//   createRestaurantSuccess,
//   createRestaurantFail,
//   deleteRestaurantRequest,
//   deleteRestaurantSuccess,
//   deleteRestaurantFail,
// } from "../slices/restaurantSlice";

// // GET RESTAURANTS
// export const getRestaurants =
//   (keyword = "") =>
//   async (dispatch) => {
//     try {
//       dispatch(getRestaurantsRequest());

//       const { data } = await api.get(`/v1/eats/stores?keyword=${keyword}`);
//       // backend returns { success, count, data }
//       dispatch(
//         getRestaurantsSuccess({
//           restaurants: data.restaurant,
//           count: data.count || (data.data ? data.data.length : 0),
//         }),
//       );
//     } catch (error) {
//       dispatch(
//         getRestaurantFail(error.response?.data?.message || error.message),
//       );
//     }
//   };

// // CREATE RESTAURANT
// export const createRestaurant = (restaurantData) => async (dispatch) => {
//   try {
//     dispatch(createRestaurantRequest());

//     const { data } = await api.post("/v1/eats/stores", restaurantData);

//     dispatch(createRestaurantSuccess(data.data));
//   } catch (error) {
//     dispatch(
//       createRestaurantFail(error.response?.data?.message || error.message),
//     );
//   }
// };

// // DELETE RESTAURANT
// export const deleteRestaurant = (id) => async (dispatch) => {
//   try {
//     dispatch(deleteRestaurantRequest());

//     await api.delete(`/v1/eats/stores/${id}`);

//     dispatch(deleteRestaurantSuccess(id));
//   } catch (error) {
//     dispatch(
//       deleteRestaurantFail(error.response?.data?.message || error.message),
//     );
//   }
// };


import api from "../../utils/api";

import {
  getRestaurantsRequest,
  getRestaurantsSuccess,
  getRestaurantFail,
  createRestaurantRequest,
  createRestaurantSuccess,
  createRestaurantFail,
  deleteRestaurantRequest,
  deleteRestaurantSuccess,
  deleteRestaurantFail,
} from "../slices/restaurantSlice";

// GET RESTAURANTS
export const getRestaurants =
  (keyword = "") =>
  async (dispatch) => {
    try {
      dispatch(getRestaurantsRequest());

      const { data } = await api.get(`/v1/eats/stores?keyword=${keyword}`);

      console.log("API Response:", data);

      dispatch(
        getRestaurantsSuccess({
          restaurants: data.data || [],
          count: data.count || 0,
        })
      );
    } catch (error) {
      dispatch(
        getRestaurantFail(
          error.response?.data?.message || error.message
        )
      );
    }
  };

// CREATE RESTAURANT
export const createRestaurant = (restaurantData) => async (dispatch) => {
  try {
    dispatch(createRestaurantRequest());

    const { data } = await api.post("/v1/eats/stores", restaurantData);

    dispatch(createRestaurantSuccess(data.data));
  } catch (error) {
    dispatch(
      createRestaurantFail(
        error.response?.data?.message || error.message
      )
    );
  }
};

// DELETE RESTAURANT
export const deleteRestaurant = (id) => async (dispatch) => {
  try {
    dispatch(deleteRestaurantRequest());

    await api.delete(`/v1/eats/stores/${id}`);

    dispatch(deleteRestaurantSuccess(id));
  } catch (error) {
    dispatch(
      deleteRestaurantFail(
        error.response?.data?.message || error.message
      )
    );
  }
};