import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isLoggedIn: false,
  loading: false,
  error: null,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    register: (state, action) => {
      const userData = action.payload;
      state.user = {
        id: userData.id,
        fullname: userData.fullname,
        email: userData.email,
        role: userData.role || "user",
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      };
      state.loading = false;
      state.error = null;
    },

    login: (state, action) => {
      const userData = action.payload;
      state.user = {
        id: userData.id,
        fullname: userData.fullname,
        email: userData.email,
        role: userData.role,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      };
      state.token = userData.token;
      state.isLoggedIn = true;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.error = null;
      state.message = null;
      state.loading = false;
    },
    setUser: (state, action) => {
      const userData = action.payload;
      state.user = {
        id: userData.id,
        fullname: userData.fullname,
        email: userData.email,
        role: userData.role,
        avatar: userData.image,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      };
      state.token = userData.token || state.token;
      state.isLoggedIn = !!userData.token;
    },
  },
});

export const {
  setLoading,
  setError,
  setMessage,
  register,
  login,
  logout,
  setUser,
  clearError,
  clearMessage,
} = authSlice.actions;

export default authSlice.reducer;
