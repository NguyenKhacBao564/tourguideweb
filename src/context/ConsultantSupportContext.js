import React, { createContext, useState, useContext } from "react";
import {
    fetchSupportRequests,
    updateRequestStatus,
    sendResponse,
} from "../api/consultantSupportAPI";

const ConsultantSupportContext = createContext();

export const ConsultantSupportProvider = ({ children }) => {
    const [supportRequests, setSupportRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Lấy danh sách yêu cầu hỗ trợ
    const handleFetchSupportRequests = async () => {
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
    };

    // Cập nhật trạng thái yêu cầu hỗ trợ
    const handleUpdateRequestStatus = async (requestId, newStatus) => {
        try {
            const data = await updateRequestStatus(requestId, newStatus);
            setSupportRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.request_id === requestId ? { ...request, status: newStatus } : request
                )
            );
            return data;
        } catch (err) {
            throw new Error(err.message || "Không thể cập nhật trạng thái yêu cầu. Vui lòng thử lại.");
        }
    };

    // Gửi phản hồi cho yêu cầu hỗ trợ và lưu vào bảng Customer_Support_Response
    const handleSendResponse = async (requestId, employeeId, responseMessage) => {
        try {
            const responseData = {
                request_id: requestId,
                emp_id: employeeId,
                re_message: responseMessage,
                date: new Date().toISOString(),
            };
            const data = await sendResponse(responseData);

            // Cập nhật trạng thái yêu cầu thành "RESOLVED" sau khi phản hồi
            await handleUpdateRequestStatus(requestId, "RESOLVED");

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
                updateRequestStatus: handleUpdateRequestStatus,
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