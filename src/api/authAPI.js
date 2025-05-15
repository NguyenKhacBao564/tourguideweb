import axios from "axios";
import { API_URL } from "../utils/API_Port";



// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    // Lấy mã lỗi và thông báo từ response
    if (error.response && error.response.data) {
      const err = new Error(error.response.data.message || 'Có lỗi xảy ra khi đăng nhập');
      err.code = error.response.data.code || 'UNKNOWN_ERROR';
      throw err;
    } else {
      const err = new Error('Không thể kết nối đến máy chủ');
      err.code = 'NETWORK_ERROR';
      throw err;
    }
  }
};

// Register new user
export const registerUser = async (fullname, email, password, phone) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      fullname,
      email,
      password,
      phone,
    });
    return response.data;
  } catch (error) {
    // Lấy mã lỗi và thông báo từ response
    if (error.response && error.response.data) {
      const err = new Error(error.response.data.message || 'Có lỗi xảy ra khi đăng ký');
      err.code = error.response.data.code || 'UNKNOWN_ERROR';
      throw err;
    } else {
      const err = new Error('Không thể kết nối đến máy chủ');
      err.code = 'NETWORK_ERROR';
      throw err;
    }
  }
};

// Get user info
export const getUserData = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/auth/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}


// Other auth-related API calls can be added here 