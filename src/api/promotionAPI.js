import axios from 'axios';
import { API_URL } from '../utils/API_Port';

export const getPromotionList = async () => {
    try {
        const response = await axios.get(`${API_URL}/promotions`);
        return response.data;
    } catch (error) {
        console.error("Error fetching promotions:", error);
        throw error;
    }
};


