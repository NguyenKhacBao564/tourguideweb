import axios from "axios";
import { API_URL } from "./API_Port";

// Lấy danh sách tour
export const getTour = async () => {
  try {
    const response = await axios.get(`${API_URL}/tours`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi khi lấy danh sách tour");
  }
};

// Lấy chi tiết một tour theo ID
export const getTourById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/tours/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi khi lấy chi tiết tour");
  }
};

// Thêm tour mới
export const addTour = async (tourData) => {
  try {
    const response = await axios.post(`${API_URL}/tours`, tourData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi khi thêm tour");
  }
};

// Cập nhật tour
export const updateTour = async (tourData) => {
  try {
    const response = await axios.put(`${API_URL}/tours/update/${tourData.tour_id}`, tourData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi khi cập nhật tour");
  }
};

// Xóa tour
export const deleteTour = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/tours/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi khi xóa tour");
  }
};

// Khóa tour
export const blockTour = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/tours/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi khi khóa tour");
  }
}

