const {sql, getPool} = require("../config/db");
const { insertItinerary, updateItinerary } = require("./scheduleController");
const { addTourPrice, updateTourPrice } = require("./tourPriceController");
const { uploadTourImage } = require("./imageController");


//Lấy danh sách tất cả các tour
const getTour =  async (req, res) => {
  try{
    const pool = await getPool();
    const result = await pool.request()
    .query(`SELECT t.tour_id,t.branch_id, t.name, t.destination,t.departure_location,t.start_date,t.end_date,t.max_guests,t.transport,t.created_at,t.description, t.duration, tp.age_group,tp.price 
        FROM Tour AS t
        LEFT JOIN Tour_Price AS tp 
        ON t.tour_id = tp.tour_id WHERE t.status = 'active'`);

      // Nhóm dữ liệu theo tour_id
    const toursMap = {};
    result.recordset.forEach((row) => {
      if (!toursMap[row.tour_id]) {
        toursMap[row.tour_id] = {
          tour_id: row.tour_id,
          branch_id: row.branch_id,
          name: row.name,
          destination: row.destination,
          departureLocation: row.departure_location,
          start_date: row.start_date,
          end_date: row.end_date,
          max_guests: row.max_guests,
          transport: row.transport,
          duration: row.duration,
          created_at: row.created_at,
          description: row.description,
          prices: [],
        };
      }
      if (row.age_group && row.price !== null) {
        toursMap[row.tour_id].prices.push({
          age_group: row.age_group,
          price: row.price,
        });
      }
    });
    const tours = Object.values(toursMap);
    return res.status(200).json(tours);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const getTourByProvince = async (req, res) => {
  const province = req.params.province;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    const pool = await getPool();

    // Đếm tổng số tour
    const countResult = await pool.request()
      .input('province', sql.NVarChar, `%${province}%`)
      .query(`
        SELECT COUNT(DISTINCT t.tour_id) as total 
        FROM Tour AS t 
        WHERE t.destination LIKE @province AND t.status = 'active'
      `);
    const totalTours = countResult.recordset[0].total;
    const totalPages = Math.ceil(totalTours / limit);

    // Lấy dữ liệu tour theo tỉnh và có giới hạn
    const result = await pool.request()
      .input('province', sql.NVarChar, `%${province}%`)
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, limit)
      .query(`
        WITH TOUR_SUBSET AS (SELECT * FROM Tour AS t WHERE t.destination LIKE @province AND t.status = 'active'
        ORDER BY t.created_at DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY)
        SELECT ts.tour_id, ts.branch_id, ts.name, ts.destination, ts.departure_location, ts.start_date, ts.end_date, 
                      ts.max_guests, ts.transport, ts.created_at, ts.description, ts.duration, tp.age_group, tp.price
        FROM TOUR_SUBSET ts
        LEFT JOIN Tour_Price AS tp ON ts.tour_id = tp.tour_id
      `);

    // // Nhóm dữ liệu theo tour_id
    // const toursMap = result.recordset.reduce((map, row) => {
    //   if (!map[row.tour_id]) {
    //     map[row.tour_id] = {
    //       tour_id: row.tour_id,
    //       branch_id: row.branch_id,
    //       name: row.name,
    //       destination: row.destination,
    //       departureLocation: row.departure_location,
    //       start_date: row.start_date,
    //       end_date: row.end_date,
    //       max_guests: row.max_guests,
    //       transport: row.transport,
    //       duration: row.duration,
    //       created_at: row.created_at,
    //       description: row.description,
    //       prices: [],
    //     };
    //   }
    //   if (row.age_group && row.price !== null) {
    //     map[row.tour_id].prices.push({
    //       age_group: row.age_group,
    //       price: row.price,
    //     });
    //   }
    //   return map;
    // }, {});
    const toursMap = {};
    result.recordset.forEach((row) => {
      if (!toursMap[row.tour_id]) {
        toursMap[row.tour_id] = {
          tour_id: row.tour_id,
          branch_id: row.branch_id,
          name: row.name,
          destination: row.destination,
          departureLocation: row.departure_location,
          start_date: row.start_date,
          end_date: row.end_date,
          max_guests: row.max_guests,
          transport: row.transport,
          duration: row.duration,
          created_at: row.created_at,
          description: row.description,
          prices: [],
        };
      }
      if (row.age_group && row.price !== null) {
        toursMap[row.tour_id].prices.push({
          age_group: row.age_group,
          price: row.price,
        });
      }
    });
    const tours = Object.values(toursMap);

    return res.status(200).json(tours);
  } catch (error) {
    return res.status(500).json({ error: "Lỗi server khi lấy danh sách tour", details: error.message });
  }
};
// const getTourByProvince = async (req, res) => {
//   const province = req.params.province;
//   try{
//     const pool = await getPool();
//     //Lấy 10 tour theo tỉnh được tạo gần đây
//     const result = await pool.request()
//     .query(`SELECT t.tour_id,t.branch_id, t.name, t.destination,t.departure_location,t.start_date,t.end_date,t.max_guests,t.transport,t.created_at,t.description, t.duration, tp.age_group,tp.price 
//         FROM Tour AS t
//         LEFT JOIN Tour_Price AS tp 
//         ON t.tour_id = tp.tour_id
//         WHERE t.destination LIKE '%${province}%' AND t.status = 'active'
//         ORDER BY t.created_at DESC
//         OFFSET 0 ROWS
//         FETCH NEXT 10 ROWS ONLY`);
//     const toursMap = {};
//     result.recordset.forEach((row) => {
//       if (!toursMap[row.tour_id]) {
//         toursMap[row.tour_id] = {
//           tour_id: row.tour_id,
//           branch_id: row.branch_id,
//           name: row.name,
//           destination: row.destination,
//           departureLocation: row.departure_location,
//           start_date: row.start_date,
//           end_date: row.end_date,
//           max_guests: row.max_guests,
//           transport: row.transport,
//           duration: row.duration,
//           created_at: row.created_at,
//           description: row.description,
//           prices: [],
//         };
//       }
//       if (row.age_group && row.price !== null) {
//         toursMap[row.tour_id].prices.push({
//           age_group: row.age_group,
//           price: row.price,
//         });
//       }
//     });
//     const tours = Object.values(toursMap);
//     return res.status(200).json(tours);
//   }catch(error){
//     return res.status(500).json({error: error.message});
//   }
// }

// Thêm tour mới
const createTour =  async (req, res) => {
    let transaction;
    try {
      const {
        tour_id,
        name,
        departureLocation,
        destination,
        duration,
        start_date,
        end_date,
        max_guests,
        transport,
        prices,
        description,
        branch_id,
        itinerary,
      } = req.body;
      
      console.log("req body: ",req.body);
      
      // Parse JSON strings từ FormData
      const parsedPrices = typeof prices === 'string' ? JSON.parse(prices) : prices;
      const parsedItinerary = typeof itinerary === 'string' ? JSON.parse(itinerary) : itinerary;
      
      // Xử lý uploaded files
      const imagePaths = req.files ? req.files.map(file => file.path) : [];
      
      // Xác thực dữ liệu
      if (!tour_id || !name || !start_date || !end_date || !parsedPrices || parsedPrices.length === 0) {
        return res.status(400).json({ error: "Thiếu các trường bắt buộc: tour_id, name, start_date, end_date, prices" });
      }
      const createdAt = new Date(); // Lấy thời gian hiện tại
      const pool =  await getPool();

      transaction = pool.transaction();

      // Bắt đầu transaction
      await transaction.begin();
      const tourRequest = transaction.request();
      await tourRequest
        .input("tour_id", sql.NVarChar, tour_id)
        .input("branch_id", sql.Int, branch_id)
        .input("name", sql.NVarChar, name)
        .input("duration", sql.Int, duration)
        .input("destination", sql.NVarChar, destination)
        .input("departure_location", sql.NVarChar,  departureLocation)
        .input("start_date", sql.Date, start_date)
        .input("end_date", sql.Date, end_date)
        .input("description", sql.NVarChar, description)  
        .input("max_guests", sql.Int, max_guests)
        .input("transport", sql.NVarChar, transport)
        .input("created_at", sql.DateTime, createdAt)
        .input("status", sql.NVarChar, "active")
        .query(`
          INSERT INTO Tour (tour_id, branch_id, name, duration, destination, departure_location, start_date, end_date, description, max_guests, transport, created_at, status)
          VALUES (@tour_id, @branch_id, @name, @duration, @destination, @departure_location, @start_date, @end_date, @description, @max_guests, @transport, @created_at, @status)
        `);
        
        if (imagePaths.length > 0) {
          await uploadTourImage(transaction, tour_id, imagePaths);
        }
        
        if (parsedItinerary && parsedItinerary.length > 0) {
          await insertItinerary(transaction, tour_id, parsedItinerary);
        }

        await addTourPrice(transaction, tour_id, parsedPrices);
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
  
const updateTour = async (req, res ) => {
  let transaction;
  const tourId = req.params.id;
  console.log("tourId: ", tourId);
  try{
    const {
      name,
      departureLocation,
      destination,
      duration,
      start_date,
      end_date,
      max_guests,
      transport,
      prices,
      description,
      branch_id,
      itinerary,
      existingImages,
    } = req.body;
   
    // Parse JSON strings từ FormData
    const parsedPrices = typeof prices === 'string' ? JSON.parse(prices) : prices;
    const parsedItinerary = typeof itinerary === 'string' ? JSON.parse(itinerary) : itinerary;
    const parsedExistingImages = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
    console.log("parsedExistingImages ",parsedExistingImages);
    // Xử lý uploaded files
    const imagePaths = req.files ? req.files.map(file => file.path) : [];

    const pool = await getPool();
    transaction = pool.transaction();
    await transaction.begin();

    const updateTourRequest = transaction.request();
    await updateTourRequest
    .input("tour_id", sql.NVarChar, tourId)
    .input("branch_id", sql.Int, branch_id)
    .input("name", sql.NVarChar, name)
    .input("duration", sql.Int, duration)
    .input("destination", sql.NVarChar, destination)
    .input("departure_location", sql.NVarChar,  departureLocation)
    .input("start_date", sql.Date, start_date)
    .input("end_date", sql.Date, end_date)
    .input("description", sql.NVarChar, description)
    .input("max_guests", sql.Int, max_guests)
    .input("transport", sql.NVarChar, transport)
    .query(`
      UPDATE Tour
      SET branch_id = @branch_id, name = @name, duration = @duration, destination = @destination, departure_location = @departure_location, start_date = @start_date, end_date = @end_date, description = @description, max_guests = @max_guests, transport = @transport
      WHERE tour_id = @tour_id
    `);
    console.log("update tour request sucess")
    
    // Nếu có ảnh mới, xóa ảnh cũ và thêm ảnh mới
    if (imagePaths.length > 0 
      ||  parsedExistingImages.length !== (await transaction.request().input("tour_id", sql.NVarChar, tourId).query("SELECT COUNT(*) as count FROM Tour_image WHERE tour_id = @tour_id")).recordset[0].count) {
      console.log("XÓA ẢNH ĐANG CHẠY ...")
      // Xóa ảnh cũ
      await transaction.request()
        .input("tour_id", sql.NVarChar, tourId)
        .query(`DELETE FROM Tour_image WHERE tour_id = @tour_id`);
      
        if (parsedExistingImages && parsedExistingImages.length > 0){
          await uploadTourImage(transaction, tourId, parsedExistingImages);
        }
      // Thêm ảnh mới
      if (imagePaths.length > 0) {
        await uploadTourImage(transaction, tourId, imagePaths);
      }
    }
    
    await updateItinerary(transaction, tourId, parsedItinerary);
    await updateTourPrice(transaction, tourId, parsedPrices);
    await transaction.commit();

    return res.status(200).json({ message: "Cập nhật tour thành công" });
  }catch(error){
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Lỗi khi cập nhật tour:", error);
    return res.status(500).json({ error: "Lỗi server khi cập nhật tour", details: error });
  }
}

// Lấy chi tiết một tour theo ID
const getTourById = async (req, res) => {
    try {
      const tourId = req.params.id;
      const pool = await getPool();
      const result = await pool.request()
        .input("tour_id", sql.NVarChar, tourId)
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
  
  // Cập nhật trạng thái tour
  const blockTour = async (req, res) => {
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
        .query("UPDATE Tour SET status = 'inactive' WHERE tour_id = @tour_id");

      console.log("Rows affected:", result.rowsAffected);
  
      if (result.rowsAffected[0] > 0) {
        res.json({ message: "Khóa tour thành công" });
      } else {
        res.status(404).json({ message: "Không tìm thấy tour" });
      }
    } catch (err) {
      console.error("Lỗi khi khóa tour:", err);
      res.status(500).send({ error: "Lỗi khi khóa tour", details: err });
    }
  }




  module.exports = {getTour, createTour, getTourById, blockTour, updateTour, getTourByProvince};