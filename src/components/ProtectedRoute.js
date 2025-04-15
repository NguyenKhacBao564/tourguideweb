// src/components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Nếu không có quyền, chuyển hướng về trang không có quyền
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default ProtectedRoute;