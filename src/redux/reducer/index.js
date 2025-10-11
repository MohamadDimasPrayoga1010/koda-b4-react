import { combineReducers } from "@reduxjs/toolkit";
import coffeOrderReducer from "../reducer/coffeOrder"
const rootReducer = combineReducers({
    coffeOrder: coffeOrderReducer
})

export default rootReducer