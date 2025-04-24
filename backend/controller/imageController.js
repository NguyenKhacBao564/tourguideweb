const {sql, getPool} = require("../config/db");
const multer = require("multer");
const path = require("path");
const {v4: uuidv4} = require("uuid");

// // Cấu hình multer để lưu file vào thư mục 'uploads'
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'uploads/'); // Thư mục lưu file
//     },
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       cb(null, uniqueSuffix + path.extname(file.originalname)); // Tên file duy nhất
//     }
//   });
  
//   const upload = multer({ storage: storage });

  const uploadImage = async (transaction, tourId, imagePaths) => {
    for(const imagePath of imagePaths){
        const imageId = uuidv4().replace(/-/g, '').slice(0, 10);
        await transaction.request()
        .input("image_id", sql.NVarChar, imageId)
        .input("tour_id", sql.NVarChar, tourId)
        .input("image_url", sql.NVarChar,  imagePath)
        .query(`
        INSERT INTO Tour_image (image_id, tour_id, image_url)
        VALUES (@image_id, @tour_id, @image_url)
        `)
        }
  }

  const getImages = async (req, res) => {
    try{
        const tourId = req.params.id;
        const pool = await getPool();
        const result = await pool.request()
        .input("tour_id", sql.NVarChar, tourId)
        .query(`SELECT image_url FROM Tour_image WHERE tour_id = @tour_id`)
        return res.status(200).json(result.recordset);
    }catch(error){
        throw new Error("Lỗi khi lấy ảnh tour");
    }
  }

  module.exports = { uploadImage, getImages};