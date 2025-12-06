import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { token, isLoggedIn, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !isLoggedIn) {
      navigate("/login", { 
        state: { 
          from: location,
          message: "Anda harus login terlebih dahulu"
        },
        replace: true 
      });
    } 
    else if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      navigate("/", { 
        state: { 
          message: "Anda tidak memiliki akses ke halaman ini"
        },
        replace: true 
      });
    }
  }, [token, isLoggedIn, user, allowedRoles, navigate, location]);

  if (!token || !isLoggedIn) {
    return null; 
  }


  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return children;
};

export default PrivateRoute;