// src/api/adminAPI.js
import axios from "axios";
import { API_URL } from "../utils/API_Port"; // Có thể lưu vào .env

// Lấy số liệu tổng quan
export const getOverviewStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/overview`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi khi lấy số liệu tổng quan");
  }
};

// Lấy số liệu chi nhánh
export const getBranchStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/branches`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi khi lấy số liệu chi nhánh");
  }
};

// Lấy dữ liệu biểu đồ (6 tháng gần nhất)
export const getChartData = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/chart`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi khi lấy dữ liệu biểu đồ");
  }
};

// Lấy giao dịch gần nhất
export const getTransactions = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/transactions`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi khi lấy giao dịch gần đây");
  }
};

// Lấy danh sách nhân viên
// export const getEmployees = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/api/admin/employeeFilter`);
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Lỗi khi lấy danh sách nhân viên");
//   }
// };
export const getEmployees = async ({ status = "active", page = 1, pageSize = 10 }) => {
  const res = await axios.get(`${API_URL}/api/admin/employeeFilter`, {
    params: { status, page, pageSize }
  });
  return res.data;
};

export const getTour = async ({ status = "active", page = 1, pageSize = 10 }) => {
  const res = await axios.get(`${API_URL}/api/admin/tours`, {
    params: { page, pageSize }
  });
  return res.data;
};

// export const getTour = async ({ page = 1, pageSize = 10 }) => {
//   try {
//     const response = await axios.get(`${API_URL}/api/admin/tours`);
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Lỗi khi lấy số liệu ở tour");
//   }
// };