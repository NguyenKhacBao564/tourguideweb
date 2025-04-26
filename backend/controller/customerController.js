const {sql, getPool} = require("../config/db");

const getCustomer = async (req, res) => {
    try{
        const pool = await getPool();
        const result = await pool.request().query("SELECT * FROM Customer");
        res.json(result.recordset);
    }
    catch(error){
        res.status(500).json({message: "Lỗi server", error});
    }
}

const getAvatar = async (req, res) => {
    const cusId = req.params.id;
    try{
        const pool = await getPool();
        const result = await pool.request()
            .input("cusId", sql.NVarChar, cusId)
            .query("SELECT pi_url FROM Customer WHERE cus_id = @cusId");
        res.json(result.recordset);
    }
    catch(error){
        res.status(500).json({message: "Lỗi server", error});
    }
}

const deleteCustomer = async (req, res) => {
    try{
        const cusId = req.params.id;
        const pool = await getPool();
        const result = await pool.request()
            .input("cusId", sql.NVarChar, cusId)
            .query("DELETE FROM Customer WHERE cus_id = @cusId");
        
        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: "Xóa khách hàng thành công" });
        } else {
            res.status(404).json({ message: "Không tìm thấy khách hàng" });
        }
    }
    catch(error){
        console.error("Error deleting customer:", error);
        res.status(500).json({message: "Lỗi server khi xóa khách hàng", error: error.message});
    }
}

const deleteBatchCustomer = async (req, res) => {
    try{
        const {ids} = req.body;
        
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
        }
        
        const pool = await getPool();
        
        // Xây dựng câu truy vấn với các tham số
        const request = pool.request();
        const placeholders = ids.map((_, index) => `@cusId${index}`).join(',');
        const query = `DELETE FROM Customer WHERE cus_id IN (${placeholders})`;

        // Thêm các tham số vào request
        ids.forEach((id, index) => {
            request.input(`cusId${index}`, sql.NVarChar, id);
        });
        
        // Thực hiện truy vấn
        const result = await request.query(query);
        const deletedCount = result.rowsAffected[0];
        
        if (deletedCount === ids.length) {
            return res.status(200).json({
                message: `Đã xóa thành công ${deletedCount} khách hàng`,
                deletedCount,
                failed: [],
            });
        } else {
            return res.status(207).json({
                message: `Đã xóa ${deletedCount} trên tổng số ${ids.length} khách hàng`,
                deletedCount,
                failed: ids.length - deletedCount,
            });
        }
    }
    catch(error){
        console.error("Error batch deleting customers:", error);
        res.status(500).json({message: "Lỗi server khi xóa nhiều khách hàng", error: error.message});
    }
}


module.exports = {
    getCustomer,
    deleteBatchCustomer,
    deleteCustomer,
    getAvatar
}
