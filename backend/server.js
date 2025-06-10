const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const axios = require('axios');
// const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();


const tourRoutes = require("./routes/tourRoutes");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const adminRoutes = require('./routes/adminRoutes'); // NKBao đã thêm
const paymentRoutes = require('./routes/paymentRoutes'); // VNPay payment routes
const bookingRoutes = require('./routes/bookingRoutes'); // Booking routes

require("dotenv").config();
const PORT = process.env.PORT || 3001;

const tourPriceRoutes = require("./routes/tourPriceRoutes");
const promotionRoutes = require("./routes/promotionRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const customerSupportRoutes = require("./routes/customerSupportRoutes");
const consultantSupportRoutes = require("./routes/consultantSupportRoutes");
const chatRoutes = require("./routes/chatRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const favoriteTourRoutes = require("./routes/favoriteTourRoutes");
const historyBookingRoutes = require("./routes/historyBookingRoutes");
const elasticsearchRoutes = require("./routes/elasticsearchRoutes");

app.use(cors({
  origin: [
    'http://localhost:3000', // Development
    'http://54.219.205.247', // EC2 IP
    'http://tourguideeeee.fun', // Domain
    'http://www.tourguideeeee.fun' // WWW Domain
  ], // Domain của frontend
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
app.use("/api/admin", adminRoutes); // NKBao đã thêm
app.use("/api/payment", paymentRoutes); // VNPay payment routes
app.use("/api/booking", bookingRoutes); // Booking routes
app.use("/tourPrice", tourPriceRoutes);
app.use("/favoriteTours", favoriteTourRoutes)
app.use("/tour-price", tourPriceRoutes);
app.use("/schedule", scheduleRoutes);
app.use("/historyBooking", historyBookingRoutes)

app.use("/api/customer", customerSupportRoutes); // Thêm route cho support
app.use("/api/consultant", consultantSupportRoutes);
app.use("/reviews", reviewRoutes);
app.use("/api/elasticsearch", elasticsearchRoutes); // Elasticsearch search routes
app.listen(PORT, async () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
  
  // Test Elasticsearch connection on startup
  console.log('\n📡 Đang kiểm tra kết nối Elasticsearch...');
  try {
    const { testConnection } = require('./config/elasticsearch');
    await testConnection();
  } catch (error) {
    console.error('⚠️ Không thể load Elasticsearch config:', error.message);
    console.error('💡 Hãy đảm bảo file .env có cấu hình Elasticsearch');
  }
  console.log('');
});

