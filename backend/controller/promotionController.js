const {sql, getPool} = require("../config/db");


const getPromotion = async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query("SELECT * FROM Promotion");
        return res.json(result.recordset);
    } catch (error) {
        return res.status(500).json({ error: "Lỗi server khi lấy danh sách khuyến mãi", details: error.message });
    }
}

// const addPromotion = async (req, res) => {
//     try {
//         const { promotionName, promotionCode, discount, startDate, endDate, maxUse } = req.body;
//         const pool = await getPool();
//         const result = await pool.request()
//             .input('promotionName', sql.NVarChar, promotionName)
//             .input('promotionCode', sql.NVarChar, promotionCode)
//             .input('discount', sql.Decimal(5, 2), discount)
//             .input('startDate', sql.DateTime, startDate)
//             .input('endDate', sql.DateTime, endDate)
//             .input('maxUse', sql.Int, maxUse)
//             .query("INSERT INTO Promotion (promotionName, promotionCode, discount, startDate, endDate, maxUse) VALUES (@promotionName, @promotionCode, @discount, @startDate, @endDate, @maxUse)");

//         return res.status(201).json({ message: "Khuyến mãi đã được thêm thành công" });

        
//     } catch (error) {
//         return res.status(500).json({ error: "Lỗi server khi thêm khuyến mãi", details: error.message });
//     }
// }



module.exports = {
    getPromotion,
}