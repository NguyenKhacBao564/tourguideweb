const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

const tourRoutes = require("./routes/tourRoutes");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const tourPriceRoutes = require("./routes/tourPriceRoutes");
const supportRoutes = require("./routes/supportRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");

app.use(cors());
app.use(express.json());

//Sử dụng các Route
app.use("/tours", tourRoutes);
app.use("/auth", authRoutes);
app.use("/customers", customerRoutes);
app.use("/tour-price", tourPriceRoutes);
app.use("/api", supportRoutes); // Thêm route cho support
app.use("/schedule", scheduleRoutes);
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});

