const {sql, getPool} = require("../config/db");


const getPromotion = async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query("SELECT * FROM Promotion WHERE status='active'");
        return res.json(result.recordset);
    } catch (error) {
        return res.status(500).json({ error: "Lỗi server khi lấy danh sách khuyến mãi", details: error.message });
    }
}

const createPromotion = async (req, res) => {
    try {
        const {promo_id, promo_name, code, discount_percentage, start_date, end_date, max_use } = req.body;
        const pool = await getPool();
        const result = await pool.request()
            .input('promotionId', sql.NVarChar, promo_id)
            .input('promo_name', sql.NVarChar, promo_name)
            .input('code', sql.NVarChar, code)
            .input('discount_percentage', sql.Decimal(5, 2), discount_percentage)
            .input('start_date', sql.Date, start_date)
            .input('end_date', sql.Date, end_date)
            .input('max_use', sql.Int, max_use)
            .query("INSERT INTO Promotion (promo_id, promo_name, code, discount_percentage, start_date, end_date, max_use) VALUES (@promotionId, @promo_name, @code, @discount_percentage, @start_date, @end_date, @max_use)");
        return res.status(201).json({ message: "Khuyến mãi đã được thêm thành công" });
    } catch (error) {
        return res.status(500).json({ error: "Lỗi server khi thêm khuyến mãi", details: error.message });
    }
}

const blockPromotion = async (req, res) => {
    try {
        const { promotionId } = req.params;
        const pool = await getPool();
        const result = await pool.request()
            .input('promotionId', sql.NVarChar, promotionId)
            .query("UPDATE Promotion SET status='inactive' WHERE promo_id = @promotionId");

        return res.status(200).json({ message: "Khuyến mãi đã được chặn thành công" });
    } catch (error) {
        return res.status(500).json({ error: "Lỗi server khi chặn khuyến mãi", details: error.message });
    }
}


const updatePromotion = async (req, res) => {
    try {
        const { promotionId } = req.params;
        const {  promo_name, code, discount_percentage, start_date, end_date, max_use } = req.body;
        console.log("Promotion ID: ", promotionId);
        console.log("Promotion data: ", req.body);
        const pool = await getPool();
        const result = await pool.request()
            .input('promotionId', sql.NVarChar, promotionId)
            .input('promo_name', sql.NVarChar, promo_name)
            .input('code', sql.NVarChar, code)
            .input('discount_percentage', sql.Decimal(5, 2), discount_percentage)
            .input('start_date', sql.Date, start_date)
            .input('end_date', sql.Date, end_date)
            .input('max_use', sql.Int, max_use)
            .query("UPDATE Promotion SET promo_name = @promo_name, code = @code, discount_percentage = @discount_percentage, start_date = @start_date, end_date = @end_date, max_use = @max_use WHERE promo_id = @promotionId");
        
            return res.status(200).json({ message: "Khuyến mãi đã được cập nhật thành công" });
    } catch (error) {
        return res.status(500).json({ error: "Lỗi server khi cập nhật khuyến mãi", details: error.message });
    }
}



module.exports = {
    getPromotion,
    createPromotion,
    blockPromotion,
    updatePromotion
}