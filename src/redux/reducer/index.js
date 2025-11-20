import { combineReducers } from "@reduxjs/toolkit";
import coffeOrderReducer from "../reducer/coffeOrder";
import authReducer from "../reducer/auth"; 

const rootReducer = combineReducers({
  coffeOrder: coffeOrderReducer,
  auth: authReducer, 
});

export default rootReducer;
