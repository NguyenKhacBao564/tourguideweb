import axios from "axios";
import { API_URL } from "../utils/API_Port";

export const getCustomerAccount = async () => {
    const response = await axios.get(`${API_URL}/customers`);
    return response.data;
}

export const deleteBatchCustomer = async (ids) => {
    const response = await axios.delete(`${API_URL}/customers/batch-delete`, {
        data: { ids }
    });
    return response.data;
}

export const deleteCustomer = async (id) => {
    const response = await axios.delete(`${API_URL}/customers/${id}`);
    return response.data;
}
