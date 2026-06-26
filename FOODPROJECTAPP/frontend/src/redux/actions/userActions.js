import api from "../../uitils/api"
import {
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
    
} from "../slices/userSlice"

//login
export const login = (email, password) => async(dispatch) =>{
    try{
        dispatch(userRequest())
        const {data} = await api.post("/v1/users/login", {email, password})
        dispatch(userSuccess(data.data.user))
    }catch(error){
        dispatch(userFail("login failed"))
    }
    
}

//signup/register
export const register = {userData} => async(disaptch) =>{
    try{
        diaptch(userRequest());
        const (data) = await api.post("/v1/users/signup", userData,{
            headers: {
                "Content-Type": "application/json"
            }
        })
        dispatch(userSuccess(data.data.user))

    }catch(error){
        diapatch(userFail(error.response?.data?.message))
    }
}

//load user
export const load user =() => async(dispatch)=>{
    try{
        dispatch(userRequest());
        const {data} = await api.get("/v1/uaer/me")
        dispatch(userSuccess())
    }catch(error){
        diaptach(userFail(error.response?.data?.message))
    }
}

//update profile
export const updateProfile = (userData) => async(dispatch) =>{
    try{
        dispatch(updateRequest());
        const {data} = await api.put("/v1/users/me/update", userData,{
            headers:
            {"content-Type" : "multipart/form-data"}
        })
        dispatch(updateSuccess(data.userSuccess))
    }catch(error){
        dispatch(updataFail(error.response?.data?.message))
    }
}

//logout
export const logout =() => async(dispatch) =>{
    try{
        await api.get("/v1/users/logout")
        dispatch(logoutSuccess)
    }catch(error){
        dispatch(logout(error.response?.data?.message))
    }
}