import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  orderHistory: [],
};

const coffeOrderSlice = createSlice({
  name: "coffeOrder",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const exists = state.cart.find(
        (item) => item.productId === action.payload.productId
      );
      if (!exists) {
        state.cart.push(action.payload);
      } else {
        exists.quantity += action.payload.quantity;
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (item) => item.cartItemId !== action.payload
      );
    },
    clearCart: (state) => {
      state.cart = [];
    },
    setOrderHistory: (state, action) => {
      state.orderHistory = action.payload;
    },
    addOrder: (state, action) => {
      state.orderHistory.unshift(action.payload);
    },
    buyNow: (state, action) => {
      state.cart = [action.payload];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  setOrderHistory,
  addOrder,
  buyNow,
} = coffeOrderSlice.actions;

export default coffeOrderSlice.reducer;
