const {sql, getPool} = require("../config/db");

// Hàm thêm lịch trình vào bảng Itinerary
const insertItinerary = async (transaction, tour_id, itinerary) => {
    for (const item of itinerary) {
      const { id, day_number, tour_route, description } = item;
  
      if (!id || !day_number || !tour_route || !description) {
        throw new Error('Thiếu dữ liệu!');
      }
  
      const itineraryRequest = transaction.request();
      await itineraryRequest
        .input('scheduleID', sql.NVarChar, id)
        .input('tourId', sql.NVarChar, tour_id)
        .input('dayNumber', sql.Int, day_number)
        .input('tourRoute', sql.NVarChar, tour_route)
        .input('description', sql.NVarChar, description)
        .query(`
          INSERT INTO Tour_Schedule (schedule_id, tour_id, day_number, tour_route, detail)
          VALUES (@scheduleID, @tourId, @dayNumber, @tourRoute, @description)
        `);
    }
  };

  module.exports = {
    insertItinerary
  };