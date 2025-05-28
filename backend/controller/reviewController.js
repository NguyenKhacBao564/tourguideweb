const {sql, getPool} = require("../config/db");

const getAllReviewsByTourId = async (req, res) => {
    try {
        const tour_id = req.params.id;
        console.log("Tour ID:", tour_id);
        const pool = await getPool();
        const result = await pool.request()
            .input("tour_id", sql.NVarChar, tour_id)
            .query(`SELECT r.review_id, r.tour_id, r.cus_id, r.rating, r.comment, r.review_date,
                           c.fullname AS name, c.pi_url AS avatar
                    FROM Review AS r
                    JOIN Customer AS c ON r.cus_id = c.cus_id
                    WHERE r.tour_id = @tour_id
                    ORDER BY r.review_date`);
        console.log("Reviews fetched:", result.recordset);
        return res.status(200).json(result.recordset);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const getReviewById = async (req, res) => { }

const addReview = async (req, res) => {
    try {
        const {review_id, tour_id, cus_id, rating, comment } = req.body;

        console.log("Adding review:", { review_id, tour_id, cus_id, rating, comment });
        const pool = await getPool();
        const result = await pool.request()
            .input("review_id", sql.NVarChar, review_id)
            .input("tour_id", sql.NVarChar, tour_id)
            .input("cus_id", sql.NVarChar, cus_id)
            .input("rating", sql.Int, rating)
            .input("comment", sql.NVarChar, comment)
            .query(`INSERT INTO Review (review_id,tour_id, cus_id, rating, comment, review_date)
                    VALUES (@review_id, @tour_id, @cus_id, @rating, @comment, GETDATE())`);
        return res.status(201).json({ message: "Review added successfully" });
    } catch (error) {
        console.error("Error adding review:", error);
        return res.status(500).json({ error: error.message });
    }

}



module.exports = {
    getAllReviewsByTourId,
    getReviewById,
    addReview
};