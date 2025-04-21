const {sql, getPool} = require("../config/db");
const { insertItinerary } = require("./scheduleController");
const { v4: uuidv4 } = require("uuid");
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
    let transaction;
    try {
      const {
        tourName,
        departureLocation,
        destination,
        duration,
        departureDate ,
        returnDate,
        seats,
        transportation,
        adultPrice,
        childPrice,
        infantPrice,
        description,
        branch_id,
        itinerary,
      } = req.body;
      const createdAt = new Date(); // Lấy thời gian hiện tại
      const pool =  await getPool();
      const tour_id = uuidv4().replace(/-/g, '').slice(0, 10);

      transaction = pool.transaction();

      // Bắt đầu transaction
      await transaction.begin();
      const tourRequest = transaction.request();
      await tourRequest
        .input("tour_id", sql.NVarChar, tour_id)
        .input("branch_id", sql.Int, branch_id)
        .input("name", sql.NVarChar, tourName)
        .input("duration", sql.Int, duration)
        .input("destination", sql.NVarChar, destination)
        .input("departure_location", sql.NVarChar,  departureLocation)
        .input("start_date", sql.Date, departureDate)
        .input("end_date", sql.Date, returnDate)
        .input("description", sql.NVarChar, description)
        .input("max_guests", sql.Int, seats)
        .input("transport", sql.NVarChar, transportation)
        .input("created_at", sql.DateTime, createdAt)
        .query(`
          INSERT INTO Tour (tour_id, branch_id, name, duration, destination, departure_location, start_date, end_date, description, max_guests, transport, created_at)
          VALUES (@tour_id, @branch_id, @name, @duration, @destination, @departure_location, @start_date, @end_date, @description, @max_guests, @transport, @created_at)
        `);

         await insertItinerary(transaction, tour_id, itinerary);
         await transaction.commit();

        return res.status(201).json({ message: "Thêm tour thành công" });
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      console.error("Lỗi khi thêm tour:", error);
      return res.status(500).json({ error: "Lỗi server khi thêm tour", details: error });
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
      // const tourId = parseInt(req.params.id, 10); // Chuyển về số nguyên
      // if (isNaN(tourId)) {
      //   return res.status(400).json({ error: "Invalid tour ID" });
      // }
      const tourId = req.params.id;
      const pool = await getPool();
      const result = await pool.request()
        .input("tour_id", sql.NVarChar, tourId)
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