const express = require("express");
const cors = require("cors");
const { sql, poolPromise } = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// API lấy danh sách người dùng từ SQL Server
app.get("/users", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Users"); // Đổi 'Users' thành bảng của bạn
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});

app.get("/tours", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Tour"); // Đổi 'Users' thành bảng của bạn
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});

// app.post("/tours", async (req, res))

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});

