// routes/adminRoutes.js
const express = require('express');

const {
  getOverviewStats,
  getBranchStats,
  getTourChartData,
  getRecentTransactions,
  getEmployeesByPageAndStatus,
  getToursByStatusAndPage,
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
  const { status, page, pageSize } = req.query;
  try {
    const data = await getEmployeesByPageAndStatus(status, Number(page), Number(pageSize));
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
// 7. Lấy danh sách tour theo trạng thái và phân trang
router.get('/tours', async (req, res) => {
  try {
    // page và pageSize truyền vào query string
    const page     = parseInt(req.query.page, 10)     || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    //const status   = req.query.status || 'active';

    const { tours, total } = await getToursByStatusAndPage( page, pageSize);
    res.json({ tours, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
