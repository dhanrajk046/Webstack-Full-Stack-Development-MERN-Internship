//fetch cart
//Add items
//update items
//remove items
//handle loading and errors

import api from "../../utils/api";
import {
  cartRequest,
  cartSuccess,
  cartFail,
  updateCartSuccess,
  removeCartItem,
} from "../slices/cartSlice";

//fetch cart
export const fetchCart = () => async (dispatch) => {
  try {
    dispatch(cartRequest());
    const { data } = await api.get("/v1/eats/get-cart");
    dispatch(cartSuccess(data.data))
    console.log("CART API", data.data)
  }catch (error) {
    dispatch(cartFail(error.response?.data?.message || error.message));
  }
}

//add the cart items
//fooditemsId
//restaurantId
//quantity 

export const addItemToCart =  (foodItemID, restaurantId, quantity) => async (dispatch,getState) => {
    try {
        dispatch(cartRequest());
        const {user} =getState().user;
        const {data} = await api.post("/v1/eats/add-to-cart",{
            userId:user._id,
            foodItemId,
            restaurantId,
            quantity

        })
        dispatch(cartSuccess(data.cart))
    }
    catch(error){
        dispatch(cartFail(error.response?.data?.message ));
    }
}

//update cart quantity

export const updateCartQuantity =  (foodItemID, quantity) => async (dispatch,getState) => {
    try {
        const {user} =getState().user;
        const {data} = await api.post("/v1/eats/update-cart-item",{
            userId:user._id,
            foodItemId,
            quantity

        })
        dispatch(updateCartSuccess(data.cart))
    }
    catch(error){
        dispatch(cartFail(error.response?.data?.message));
    }
}


//remove the item from the cart 



