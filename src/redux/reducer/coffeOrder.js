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
      const newItem = action.payload;

      const existingItem = state.cart.find(
        (cartItem) =>
          cartItem.productId === newItem.productId &&
          cartItem.size === newItem.size &&
          cartItem.temperature === newItem.temperature &&
          cartItem.delivery === newItem.delivery
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.cart.push({ ...newItem });
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

