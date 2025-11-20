import { createContext, useState, useEffect } from "react";
import { apiRequest } from "../utils/api";

const AuthContext = createContext({
  user: null,
  token: null,
  isLoggedIn: false,
  register: async () => {},
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiRequest("/auth/me", "GET"); 
        if (res.success) {
          setUser(res.data.user);
          setToken(res.data.token);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("Fetch user failed", err);
      }
    };
    fetchUser();
  }, []);

  const register = async (userData) => {
    try {
      const res = await apiRequest("/auth/register", "POST", userData);
      return res;
    } catch (err) {
      console.error("Register error:", err);
      return { success: false, message: "Failed to register." };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await apiRequest("/auth/login", "POST", { email, password });
      if (res.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        setIsLoggedIn(true);
      }
      return res;
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Failed to login." };
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
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
