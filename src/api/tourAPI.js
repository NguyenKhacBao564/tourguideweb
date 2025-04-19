import axios from "axios";

const API_URL = "http://localhost:3001"; // Có thể lưu vào biến môi trường sau

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
export const createTour = async (tourData) => {
  try {
    const response = await axios.post(`${API_URL}/tours`, tourData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi khi thêm tour");
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