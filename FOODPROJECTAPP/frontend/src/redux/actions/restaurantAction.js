import restaurant from "../../../../backend/models/restaurant";
import api from "../../utils/";

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
  sortByRatings,
  sortByReviews,
  showVegOnly,
  clearError,
} from "../slices/restaurantSlice";

//get
export const getRestaurants =
  (keyword = "") =>
  async (dispatch) => {
    try {
      dispact(getRestaurantsRequest);
      const { data } = await api.get(`/v1/eats/stores?keyword=${keyword}`);
      dispatch(
        getRestaurantsSuccess({
          restaurants: data.restaurants,
          count: data.count,
        }),
      );
    } catch (error) {
      dispatch(
        getRestaurantFail(error.response?.data?.message || error.message),
      );
    }
  };

//create
export const createRestaurant = (restaurant) => async (dispatch) => {
  try {
    despatch(createRestaurantRequest());

    const { data } = await api.post("/v1/eats/stores", restaurantData);

    dispatch(createRestaurantSuccess(data.data));
  } catch (error) {
    dispatch(
      createRestaurantFail(error.response?.data?.message || error.message),
    );
  }

  //delete
  //create
export const deleteRestaurant = (restaurant) => async (dispatch) => {
  try {
    despatch(deleteRestaurantRequest());

    await api.post("/v1/eats/stores/${id}");

    dispatch(deleteRestaurantSuccess(id));
  } catch (error) {
    dispatch(
      deleteRestaurantFail(error.response?.data?.message || error.message),
    );
  }
}
};
