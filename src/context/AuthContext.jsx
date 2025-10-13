import { createContext, useState, useEffect } from "react";
import {
  saveUser,
  loginUser,
  STORAGE_KEYS,
  getFromLocalStorage,
  setToLocalStorage,
} from "../utils/localStorange";

const AuthContext = createContext({
  user: null,
  isLoggedIn: false,
  register: () => {},
  login: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getFromLocalStorage(STORAGE_KEYS.USER));
  const [isLoggedIn, setIsLoggedIn] = useState(
    getFromLocalStorage(STORAGE_KEYS.IS_LOGGED_IN) || false
  );

  useEffect(() => {
    setToLocalStorage(STORAGE_KEYS.USER, user);
    setToLocalStorage(STORAGE_KEYS.IS_LOGGED_IN, isLoggedIn);
  }, [user, isLoggedIn]);

  const register = (userData) => saveUser(userData);
  const login = (email, password) => {
    const result = loginUser(email, password);
    if (result.success) {
      setUser(result.user);
      setIsLoggedIn(true);
    }
    return result;
  };


  return (
    <AuthContext.Provider value={{ user, isLoggedIn, register, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
