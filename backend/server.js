const express = require("express");
const cors = require("cors");

const app = express();


const tourRoutes = require("./routes/tourRoutes");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const adminRoutes = require('./routes/adminRoutes'); // NKBao đã thêm

require("dotenv").config();
const PORT = process.env.PORT || 3001;

const tourPriceRoutes = require("./routes/tourPriceRoutes");
const supportRoutes = require("./routes/supportRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");

app.use(cors());
app.use(express.json());
// Phục vụ file tĩnh từ thư mục uploads
app.use('/uploads', express.static('uploads'));

//Sử dụng các Route
app.use("/tours", tourRoutes);
app.use("/auth", authRoutes);
app.use("/customers", customerRoutes);
app.use("/api/admin", adminRoutes); // NKBao đã thêm
app.use("/tourPrice", tourPriceRoutes);

app.use("/tour-price", tourPriceRoutes);
app.use("/api", supportRoutes); // Thêm route cho support
app.use("/schedule", scheduleRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});

