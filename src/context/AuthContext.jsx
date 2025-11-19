import { createContext, useState } from "react";
import { apiRequest } from "../utils/api"; 

const AuthContext = createContext({
  user: null,
  isLoggedIn: false,
  register: async () => {},
  login: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  /**
   * Register user ke backend
   * @param {{ fullname: string, email: string, password: string }} userData
   * @returns {Promise<{success: boolean, message: string, data?: any}>}
   */
  const register = async (userData) => {
    try {
      const res = await apiRequest("/auth/register", "POST", userData);
      return res;
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        message: "Failed to register. Please try again.",
      };
    }
  };

  /**
   * Login user ke backend
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{success: boolean, message: string, data?: any}>}
   */
  const login = async (email, password) => {
    try {
      const res = await apiRequest("/auth/login", "POST", { email, password });
      if (res.success) {
        setUser(res.data);      
        setIsLoggedIn(true);
      }
      return res;
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Failed to login. Please try again.",
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, register, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
