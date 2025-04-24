const express = require("express");
const cors = require("cors");

const app = express();


const tourRoutes = require("./routes/tourRoutes");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const adminRoutes = require('./routes/adminRoutes'); // NKBao đã thêm

require("dotenv").config();
const PORT = process.env.PORT || 5000;
const tourPriceRoutes = require("./routes/tourPriceRoutes");
app.use(cors());
app.use(express.json());

//Sử dụng các Route
app.use("/tours", tourRoutes);
app.use("/auth", authRoutes);
app.use("/customers", customerRoutes);
app.use("/api/admin", adminRoutes); // NKBao đã thêm
app.use("/tourPrice", tourPriceRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});

