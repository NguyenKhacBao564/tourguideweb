import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Lấy danh sách yêu cầu hỗ trợ
export const fetchSupportRequests = async () => {
    try {
        const response = await axios.get(`${API_URL}/support/consultant/requests`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi khi lấy danh sách yêu cầu hỗ trợ" };
    }
};

// Cập nhật trạng thái yêu cầu hỗ trợ
export const updateRequestStatus = async (requestId, status) => {
    try {
        const response = await axios.put(`${API_URL}/support/consultant/request/${requestId}/status`, {
            status,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi khi cập nhật trạng thái yêu cầu" };
    }
};

// Gửi phản hồi cho yêu cầu hỗ trợ
export const sendResponse = async (responseData) => {
    try {
        const response = await axios.post(`${API_URL}/support/consultant/response`, responseData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi khi gửi phản hồi" };
    }
};