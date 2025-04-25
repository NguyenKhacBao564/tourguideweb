// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, getUserData } from "../api/authAPI";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  console.log("AuthProvider render")
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Hàm kiểm tra và điều hướng theo role
  const checkRole = (role, currentPath) => {
    // Tránh redirect loop: Không điều hướng nếu đã ở đúng trang
    const roleRoutes = {
      customer: "/",
      Support: "/support",
      Sales: "/businessemployee/customer",
      Admin: "/admin/dashboard",
    };
    const targetRoute = roleRoutes[role];
    if (targetRoute && currentPath !== targetRoute) {
      setTimeout(() => {
        navigate(targetRoute, { replace: true });
      }, 500);
    }
  };

  // Trong AuthContext.js
const fetchUser = async (token) => {
  try {
    const response = await getUserData(token);
    const userData = response.user;   
    console.log("userData: ", userData)
    return userData;
  } catch (error) {
    throw error;
  }
};

  //Kiểm tra token và gửi request đến server để lấy thông tin user  
  // Kiểm tra token khi khởi động
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // const decoded = jwtDecode(token);
          const userData = await fetchUser(token);
          setUser(userData);
          checkRole(userData.role, window.location.pathname);
        } catch (error) {
          console.error("Token không hợp lệ:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);


  // Hàm xử lý đăng nhập/đăng ký (tái sử dụng logic)
  const authenticateUser = async (apiCall, ...args) => {
    setLoading(true);
    try {
      const data = await apiCall(...args);
      localStorage.setItem("token", data.token);
      const userData = await fetchUser(data.token);
      setUser(userData);
      checkRole(userData.role, window.location.pathname);
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    return authenticateUser(loginUser, email, password);
  };

  const regist = async (fullname, email, password, phone) => {
    return authenticateUser(registerUser, fullname, email, password, phone);
  };


  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    console.log("Logout success")
    navigate("/")
  };

  // Sử dụng useMemo để tránh tạo object mới
  const contextValue = useMemo(() => ({
    user,
    loading,
    login,
    regist,
    logout,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};