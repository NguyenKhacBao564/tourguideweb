// routes/adminRoutes.js
const express = require('express');

const {
  getOverviewStats,
  getBranchStats,
  getTourChartData,
  getRecentTransactions,
  getEmployeesByPageAndStatus,
  getBranch
} = require('../services/adminServices');
const router = express.Router();

// 1. Tổng quan
router.get('/overview', async (req, res) => {
  try {
    const data = await getOverviewStats();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Chi nhánh
router.get('/branches', async (req, res) => {
  try {
    const list = await getBranchStats();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Dữ liệu biểu đồ
router.get('/chart', async (req, res) => {
  try {
    const chart = await getTourChartData();
    res.json(chart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Giao dịch gần đây
router.get('/transactions', async (req, res) => {
  try {
    const tx = await getRecentTransactions();
    res.json(tx);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Liệt kê nhân viên theo điều kiện 
router.get('/employeeFilter', async (req, res) => {
  try {
    const data = await getEmployeesByPageAndStatus();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Lấy thông tin các chi nhánh
router.get('/getBranch', async (req, res) => {
  try {
    const data = await getBranch();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
