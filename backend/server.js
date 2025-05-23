const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = 5000;

const tourRoutes = require("./routes/tourRoutes");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const tourPriceRoutes = require("./routes/tourPriceRoutes");
const promotionRoutes = require("./routes/promotionRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const customerSupportRoutes = require("./routes/customerSupportRoutes");
const consultantSupportRoutes = require("./routes/consultantSupportRoutes");
const chatRoutes = require("./routes/chatRoutes");

app.use(cors({
  origin: 'http://localhost:3000', // Domain của frontend
  credentials: true, // Cho phép gửi cookie
}));
app.use(express.json());
app.use(cookieParser());

// Phục vụ file tĩnh từ thư mục uploads
app.use('/uploads', express.static('uploads'));

//Sử dụng các Route
app.use("/chat", chatRoutes);
app.use("/tours", tourRoutes);
app.use("/promotions", promotionRoutes);
app.use("/auth", authRoutes);
app.use("/customers", customerRoutes);
app.use("/tour-price", tourPriceRoutes);
app.use("/schedule", scheduleRoutes);
app.use("/api", customerSupportRoutes); // Thêm route cho support
app.use("/api", consultantSupportRoutes);
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});

