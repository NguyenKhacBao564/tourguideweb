const {sql, getPool} = require("../config/db");


//Lấy danh sách tất cả các tour
const getTour =  async (req, res) => {
    try{
        const pool =  await getPool();
        const result = await pool.request().query("SELECT * FROM Tour");
        res.json(result.recordset);
    }
    //Trả về lỗi chi tiết
    catch (error){
        res.status(500).json({message: "Lỗi server", error});
    }
}
  
// Thêm tour mới
const createTour =  async (req, res) => {
    try {
      const {
        tour_id,
        name,
        duration,
        destination,
        departure,
        startDate,
        endDate,
        maxGuests,
        transport,
        description,
        branch_id
      } = req.body;
      const createdAt = new Date(); // Lấy thời gian hiện tại
      const pool =  await getPool();
      await pool.request()
      .input("tour_id", sql.Int, tour_id)
        .input("branch_id", sql.Int, branch_id)
        .input("name", sql.NVarChar, name)
        .input("duration", sql.Int, duration)
        .input("destination", sql.NVarChar, destination)
        .input("departure_location", sql.NVarChar, departure)
        .input("start_date", sql.Date, startDate)
        .input("end_date", sql.Date, endDate)
        .input("description", sql.NVarChar, description)
        .input("max_guests", sql.Int, maxGuests)
        .input("transport", sql.NVarChar, transport)
        .input("created_at", sql.DateTime, createdAt)
        .query(`
          INSERT INTO Tour (tour_id, branch_id, name, duration, destination, departure_location, start_date, end_date, description, max_guests, transport, created_at)
          VALUES (@tour_id, @branch_id, @name, @duration, @destination, @departure_location, @start_date, @end_date, @description, @max_guests, @transport, @created_at)
        `);
      res.status(201).json({ message: "Thêm tour thành công" });
    } catch (error) {
      console.error("Lỗi khi thêm tour:", error);
      res.status(500).json({ error: "Lỗi server khi thêm tour", details: error });
    }
  }
  
// Lấy chi tiết một tour theo ID
const getTourById = async (req, res) => {
    try {
      const tourId = parseInt(req.params.id, 10);
      const pool = await getPool();
      const result = await pool.request()
        .input("tour_id", sql.Int, tourId)
        .query("SELECT * FROM Tour WHERE tour_id = @tour_id");
  
      if (result.recordset.length > 0) {
        res.json(result.recordset[0]);
      } else {
        res.status(404).json({ message: "Không tìm thấy tour" });
      }
    } catch (err) {
      res.status(500).json({ error: "Lỗi server", details: err });
    }
  }
  

// Xóa tour theo ID
const deleteTour = async (req, res) => {
    try {
      console.log("Received delete request for tour_id:", req.params.id);
      const tourId = parseInt(req.params.id, 10); // Chuyển về số nguyên
      if (isNaN(tourId)) {
        return res.status(400).json({ error: "Invalid tour ID" });
      }
  
      const pool = await getPool();
      const result = await pool.request()
        .input("tour_id", sql.Int, tourId)
        .query("DELETE FROM Tour WHERE tour_id = @tour_id");

      console.log("Rows affected:", result.rowsAffected);
  
      if (result.rowsAffected[0] > 0) {
        res.json({ message: "Xóa thành công" });
      } else {
        res.status(404).json({ message: "Không tìm thấy tour" });
      }
    } catch (err) {
      console.error("Lỗi khi xóa tour:", err);
      res.status(500).send({ error: "Lỗi khi xóa tour", details: err });
    }
  }

  module.exports = {getTour, createTour, getTourById, deleteTour};