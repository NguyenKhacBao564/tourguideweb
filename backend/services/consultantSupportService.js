const { sql, getPool } = require("../config/db");
const ERROR_MESSAGES = require("../utils/errorConstants");

// Lấy danh sách yêu cầu hỗ trợ
const getSupportRequests = async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool
            .request()
            .query("SELECT * FROM Customer_Support_Request");
        res.json(result.recordset);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu cầu hỗ trợ:", error.message);
        return res.status(500).json({
            code: ERROR_MESSAGES.API.SERVER_ERROR.code,
            message: ERROR_MESSAGES.API.SERVER_ERROR.message,
        });
    }
};

// Cập nhật trang thái yêu cầu hỗ trợ
const updateSupportRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        const pool = await getPool();
        const result = await pool
            .request()
            .input("request_id", sql.Int, requestId)
            .input("status", sql.VarChar, status)
            .query(`
          UPDATE Customer_Support_Request
          SET status = @status
          WHERE request_id = @request_id
        `);

        if (result.rowsAffected[0] > 0) {
            res.json({ message: "Cập nhật trạng thái thành công" });
        } else {
            res.status(404).json({ message: "Không tìm thấy yêu cầu hỗ trợ" });
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error.message);
        return res.status(500).json({
            code: ERROR_MESSAGES.API.SERVER_ERROR.code,
            message: ERROR_MESSAGES.API.SERVER_ERROR.message,
        });
    }
};

// Lưu phản hồi vào bảng Customer_Support_Response
const createSupportResponse = async (req, res) => {
    try {
        const { request_id, emp_id, response_message, response_date } = req.body;

        if (!request_id || !emp_id || !response_message) {
            return res.status(400).json({
                code: ERROR_MESSAGES.SUPPORT.REQUEST_FAILED.code,
                message: "Vui lòng điền đầy đủ thông tin phản hồi",
            });
        }

        const pool = await getPool();
        const result = await pool
            .request()
            .input("request_id", sql.Int, request_id)
            .input("emp_id", sql.VarChar, emp_id)
            .input("response_message", sql.VarChar, response_message)
            .input("response_date", sql.DateTime, new Date(response_date))
            .query(`
          INSERT INTO Customer_Support_Response (request_id, emp_id, response_message, response_date)
          VALUES (@request_id, @emp_id, @response_message, @response_date)
        `);

        res.status(201).json({ message: "Phản hồi đã được gửi thành công" });
    } catch (error) {
        console.error("Lỗi khi gửi phản hồi:", error.message);
        return res.status(500).json({
            code: ERROR_MESSAGES.API.SERVER_ERROR.code,
            message: ERROR_MESSAGES.API.SERVER_ERROR.message,
        });
    }
};

module.exports = { getSupportRequests, updateSupportRequestStatus, createSupportResponse };