import React, { createContext, useState, useEffect } from "react";
import { apiRequest } from "../utils/api";
import { setToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from "../utils/localStorange";

const AuthContext = createContext({
  user: null,
  token: null,
  isLoggedIn: false,
  loading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getFromLocalStorage(STORAGE_KEYS.USER);
    const storedToken = getFromLocalStorage(STORAGE_KEYS.TOKEN);
    const storedLoggedIn = getFromLocalStorage(STORAGE_KEYS.IS_LOGGED_IN) === "true";

    if (storedUser && storedToken && storedLoggedIn) {
      setUser(storedUser);
      setToken(storedToken);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await apiRequest("/auth/login", "POST", { email, password });
      if (res.success) {
        setUser(res.data);
        setToken(res.data.token);
        setIsLoggedIn(true);

        setToLocalStorage(STORAGE_KEYS.USER, res.data);
        setToLocalStorage(STORAGE_KEYS.TOKEN, res.data.token);
        setToLocalStorage(STORAGE_KEYS.IS_LOGGED_IN, "true");
      }
      return res;
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Login failed" };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await apiRequest("/auth/logout", "POST", null, {
          Authorization: `Bearer ${token}`,
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setToken(null);
      setIsLoggedIn(false);

      setToLocalStorage(STORAGE_KEYS.USER, null);
      setToLocalStorage(STORAGE_KEYS.TOKEN, null);
      setToLocalStorage(STORAGE_KEYS.IS_LOGGED_IN, "false");
    }
  };

  const register = async (userData) => {
    try {
      const res = await apiRequest("/auth/register", "POST", userData);
      return res;
    } catch (err) {
      console.error("Register error:", err);
      return { success: false, message: "Registration failed" };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn, login, logout, register, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
