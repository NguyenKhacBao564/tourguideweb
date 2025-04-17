// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/authAPI";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  console.log("AuthProvider render")
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    // Kiểm tra nếu có token trong localStorage khi tải trang
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        console.log("Decoded token:", decoded);
      } catch (error) {
        console.error("Token không hợp lệ:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Reach to Context...")
      const data = await loginUser(email, password);
      console.log("Data respone: ", data)
      localStorage.setItem("token", data.token);
      setUser(data.user)
      return data.user;
    } catch (error) {
      // Chuyển tiếp lỗi
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    console.log("Logout success")
    navigate("/login")
  };

  const regist = async (fullname, email, password, phone) => {
    try {
      const data = await registerUser(fullname, email, password, phone);
      localStorage.setItem("token", data.token);
      setUser(data.user)
      return data.user;
    } catch (error) {
      // Chuyển tiếp lỗi
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, regist, logout }}>
      {children}
    </AuthContext.Provider>
  );
};