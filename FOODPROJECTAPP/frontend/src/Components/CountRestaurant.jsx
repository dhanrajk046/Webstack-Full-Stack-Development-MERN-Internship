import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getRestaurants } from "../redux/actions/restaurantAction";
import "./css/count.css";

const CountRestaurant = () => {
  const dispatch = useDispatch();

  const { count, showVegOnly, loading, error, restaurants } = useSelector(
    (state) => state.restaurants,
  );

  const pureVegRestaurantsCount = Array.isArray(restaurants)
    ? restaurants.filter((r) => r.isVeg).length
    : 0;

  useEffect(() => {
    dispatch(getRestaurants());
  }, [dispatch, showVegOnly]);

  return (
    <div>
      {loading ? (
        <p> Loading restaurant count...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <p className="NumOfRestro">
          {showVegOnly ? pureVegRestaurantsCount : count}
          <span className="Restro">
            {showVegOnly
              ? pureVegRestaurantsCount === 1
                ? " restaurant"
                : " restaurants"
              : count === 1
                ? " restaurant"
                : " restaurants"}
          </span>
        </p>
      )}
      <hr></hr>
    </div>
  );
};

export default CountRestaurant;
