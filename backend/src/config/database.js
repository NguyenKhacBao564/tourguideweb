require('dotenv').config(); 
// backend/src/config/database.js
const sql = require('mssql');

// Cấu hình chuỗi kết nối MSSQL
const dbConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASS || "nguyenKhacBao123",
  server: process.env.DB_HOST || 'localhost',
  port: 1433,
  database: process.env.DB_NAME || 'master',
  options: {
    encrypt: true, 
    trustServerCertificate: true // nếu dev local Windows
  }
};

// Một lần thiết lập connection pool
let poolPromise;

async function getPool() {
  if (!poolPromise) {
    try {
      poolPromise = await sql.connect(dbConfig);
      console.log('Kết nối DB MSSQL thành công');
    } catch (err) {
      console.error('Lỗi kết nối DB:', err);
      throw err;
    }
  }
  return poolPromise;
}

module.exports = {
  sql,
  getPool
};
//dùng để check Connection
// async function checkConnection() {
//   try {
//       let pool = await sql.connect(dbConfig);
//       console.log('DB_PASS from env =', process.env.DB_PASS);
//       console.log('✅ Kết nối MSSQL thành công!');
//       pool.close(); // Đóng kết nối sau khi kiểm tra
//   } catch (err) {
//       console.error('❌ Lỗi kết nối MSSQL:', err.message);
//   }
// }

// checkConnection();
