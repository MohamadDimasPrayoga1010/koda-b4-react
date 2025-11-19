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

  const register = async (userData) => {
    const res = await apiRequest("/auth/register", "POST", userData);
    return res;
  };

  const login = async (email, password) => {
    const res = await apiRequest("/auth/login", "POST", { email, password });
    if (res.success) {
      setUser(res.data);
      setIsLoggedIn(true);
      localStorage.setItem("token", res.data.token);
    }
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, register, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
