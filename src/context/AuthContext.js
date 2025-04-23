// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, registerUser } from "../api/authAPI";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  console.log("AuthProvider render")
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Kiểm tra nếu có token trong localStorage khi tải trang
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Lấy thêm thông tin user từ localStorage nếu có
        const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");
        setUser({
          ...decoded,
          ...storedUser
        });
        setIsAuthenticated(true);
        console.log("Decoded token:", decoded);
      } catch (error) {
        console.error("Token không hợp lệ:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Reach to Context...")
      const data = await loginUser(email, password);
      console.log("Data response: ", data)
      localStorage.setItem("token", data.token);
      // Lưu thêm thông tin user vào localStorage
      localStorage.setItem("userData", JSON.stringify(data.user));
      setUser(data.user)
      setIsAuthenticated(true);
      // Chuyển hướng sau khi đăng nhập
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
      return data.user;
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
    setIsAuthenticated(false);
    console.log("Logout success")
    navigate("/")
  };

  const regist = async (fullname, email, password, phone) => {
    try {
      const data = await registerUser(fullname, email, password, phone);
      localStorage.setItem("token", data.token);
      // Lưu thêm thông tin user vào localStorage
      localStorage.setItem("userData", JSON.stringify(data.user));
      setUser(data.user)
      setIsAuthenticated(true);
      navigate("/");
      return data.user;
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, regist, logout }}>
      {children}
    </AuthContext.Provider>
  );
};