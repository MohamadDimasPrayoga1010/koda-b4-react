import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { token, isLoggedIn, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!token || !isLoggedIn) {
    return (
      <Navigate 
        to="/login" 
        replace 
      />
    );
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return (
      <Navigate 
        to="/" 
        state={{ 
          message: "Anda tidak memiliki akses ke halaman ini"
        }}
        replace 
      />
    );
  }

  return children;
};

export default PrivateRoute;