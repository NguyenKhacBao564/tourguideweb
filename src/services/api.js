// src/services/api.js

import axios from 'axios';

// Tạo một instance axios với cấu hình sẵn
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api', 
});

// Ví dụ hàm login
export const login = async (email, password) => {
  try {
    const res = await axiosInstance.post('/auth/login', { email, password });
    return res.data; // trả về dữ liệu JSON
  } catch (error) {
    console.error('Lỗi khi gọi API login:', error);
    throw error;     // ném ra để component xử lý tiếp
  }
};

// Bạn có thể tạo thêm các hàm gọi API khác, ví dụ: getTours, createTour, v.v.
