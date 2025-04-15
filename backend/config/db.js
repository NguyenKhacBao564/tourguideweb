require("dotenv").config() // Thay vì chỉ require("dotenv").config();
const sql = require("mssql");

// Cấu hình kết nối SQL Server
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Tạo kết nối đến SQL Server
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("✅ Đã kết nối SQL Server!");
    return pool;
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối SQL Server: ", err);
  });

module.exports = {
  sql,
  poolPromise,
};
