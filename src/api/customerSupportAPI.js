import axios from "axios";

const API_URL = "http://localhost:5000";

export const createSupportRequest = async (supportData) => {
    try {
        const response = await axios.post(`${API_URL}/api/customer/support/request`, supportData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi khi gửi yêu cầu hỗ trợ" };
    }
};