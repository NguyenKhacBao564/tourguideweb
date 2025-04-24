import axios from "axios";
import { API_URL } from "../utils/API_Port";

export const getImages = async (tour_id) => {
  try{
    const response = await axios.get(`${API_URL}/tours/images/${tour_id}`);
    return response.data;
  }catch(err){
    throw new Error(err.response?.data?.message || "Lỗi khi lấy ảnh");
  }
}

