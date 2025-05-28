import axios from 'axios';
import { API_URL } from '../utils/API_Port';


export const getReviewList = async (tour_id) => {

    try {
        const response = await axios.get(`${API_URL}/reviews/${tour_id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
}

export const addReview = async (id, reviewData) => {
    try {
        const response = await axios.post(`${API_URL}/reviews/`, reviewData);
        return response.data;
    } catch (error) {
        console.error("Error adding review:", error);
        throw error;
    }
}