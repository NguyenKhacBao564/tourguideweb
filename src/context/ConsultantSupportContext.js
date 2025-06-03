import React, { createContext, useState, useContext, useCallback } from "react";
import {
    fetchSupportRequests,
    sendResponse,
} from "../api/consultantSupportAPI";
import { v4 as uuidv4 } from 'uuid'; // Thêm thư viện uuid để tạo response_id

const ConsultantSupportContext = createContext();

export const ConsultantSupportProvider = ({ children }) => {
    const [supportRequests, setSupportRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Lấy danh sách yêu cầu hỗ trợ
    const handleFetchSupportRequests = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchSupportRequests();
            setSupportRequests(data);
            setError(null);
        } catch (err) {
            setError(err.message || "Không thể lấy danh sách yêu cầu hỗ trợ. Vui lòng thử lại.");
            console.error("Lỗi khi lấy danh sách yêu cầu hỗ trợ:", err);
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array since this function doesn't depend on any props or state

    // Gửi phản hồi cho yêu cầu hỗ trợ và lưu vào bảng Customer_Support_Response
    const handleSendResponse = async (requestId, employeeId, responseMessage) => {
        try {
            // Kiểm tra dữ liệu đầu vào
            if (!requestId || !employeeId || !responseMessage) {
                throw new Error("Thiếu thông tin: requestId, employeeId, hoặc responseMessage");
            }
            const responseId = `RES${uuidv4().replace(/-/g, '').slice(0, 15)}`; // Tạo response_id duy nhất
            const responseData = {
                response_id: responseId, // Thêm response_id
                request_id: requestId,
                emp_id: employeeId,
                re_message: responseMessage,
                day: new Date().toISOString(),
            };
            const data = await sendResponse(responseData);

            // Cập nhật state local để phản ánh trạng thái RESOLVED
            setSupportRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.request_id === requestId ? { ...request, status: "RESOLVED" } : request
                )
            );

            return data;
        } catch (err) {
            throw new Error(err.message || "Không thể gửi phản hồi. Vui lòng thử lại.");
        }
    };

    return (
        <ConsultantSupportContext.Provider
            value={{
                supportRequests,
                fetchSupportRequests: handleFetchSupportRequests,
                sendResponse: handleSendResponse,
                loading,
                error,
            }}
        >
            {children}
        </ConsultantSupportContext.Provider>
    );
};

// Hook để sử dụng ConsultantSupportContext
export const useConsultantSupport = () => {
    const context = useContext(ConsultantSupportContext);
    if (!context) {
        throw new Error("useConsultantSupport phải được sử dụng bên trong ConsultantSupportProvider");
    }
    return context;
};