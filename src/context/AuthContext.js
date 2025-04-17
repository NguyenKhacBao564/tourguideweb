// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      console.log("Reach to Context...")
      const data = response.data;
      console.log("Data respone: ", data)
      localStorage.setItem("token", data.token);
      setUser(data.user)
      return data.user;
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
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
      const response = await axios.post("http://localhost:5000/auth/register", {
        fullname,
        email,
        password,
        phone,
      });
      const data = response.data;
      localStorage.setItem("token", data.token);
      setUser(data.user)
      // return data.user;
    } catch (error) {
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, regist, logout }}>
      {children}
    </AuthContext.Provider>
  );
};