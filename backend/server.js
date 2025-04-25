const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

const tourRoutes = require("./routes/tourRoutes");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const tourPriceRoutes = require("./routes/tourPriceRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const customerSupportRoutes = require("./routes/customerSupportRoutes");
const consultantSupportRoutes = require("./routes/consultantSupportRoutes");

app.use(cors());
app.use(express.json());
// Phục vụ file tĩnh từ thư mục uploads
app.use('/uploads', express.static('uploads'));

//Sử dụng các Route
app.use("/tours", tourRoutes);
app.use("/auth", authRoutes);
app.use("/customers", customerRoutes);
app.use("/tour-price", tourPriceRoutes);
app.use("/schedule", scheduleRoutes);
app.use("/api", customerSupportRoutes); // Thêm route cho support
app.use("/api", consultantSupportRoutes);
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});

