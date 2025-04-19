// services/adminServices.js

const { sql, getPool } = require("../config/db"); // Lấy kết nối DB và module mssql :contentReference[oaicite:0]{index=0}&#8203;:contentReference[oaicite:1]{index=1}
const ERROR_MESSAGES = require("../utils/errorConstants"); // Thông điệp lỗi chung :contentReference[oaicite:2]{index=2}&#8203;:contentReference[oaicite:3]{index=3}
const dbConfig = require('../config/db');  
// Lấy số liệu tổng quan cho dashboard
const getOverviewStats = async () => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT
        (SELECT COUNT(*) FROM Booking)          AS totalBookings,
        (SELECT ISNULL(SUM(amount), 0) FROM Payment) AS totalRevenue,
        (SELECT COUNT(*) FROM Customer)         AS totalCustomers,
        (SELECT COUNT(*) FROM Tour)             AS totalTours
    `);
    return result.recordset[0];
  } catch (error) {
    console.error("Lỗi khi lấy số liệu tổng quan:", error);
    throw new Error(ERROR_MESSAGES.API.SERVER_ERROR.message);
  }
};

// Lấy số tour theo từng chi nhánh
const getBranchStats = async () => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT
        b.branch_id,
        b.branch_name,
        COUNT(t.tour_id) AS totalTours
      FROM Branch b
      LEFT JOIN Tour t ON b.branch_id = t.branch_id
      GROUP BY b.branch_id, b.branch_name
    `);
    return result.recordset;
  } catch (error) {
    console.error("Lỗi khi lấy số liệu chi nhánh:", error);
    throw new Error(ERROR_MESSAGES.API.SERVER_ERROR.message);
  }
};

// Lấy dữ liệu biểu đồ số booking theo tháng (6 tháng gần nhất)
const getTourChartData = async () => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT
        YEAR(booking_date) AS year,
        MONTH(booking_date) AS month,
        COUNT(*)           AS count
      FROM Booking
      WHERE booking_date >= DATEADD(month, -5, GETDATE())
      GROUP BY YEAR(booking_date), MONTH(booking_date)
      ORDER BY YEAR(booking_date), MONTH(booking_date)
    `);
    return result.recordset.map(item => ({
      month: `${item.year}-${String(item.month).padStart(2, '0')}`,
      count: item.count
    }));
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu biểu đồ tour:", error);
    throw new Error(ERROR_MESSAGES.API.SERVER_ERROR.message);
  }
};

// Lấy 5 giao dịch gần nhất (dựa vào booking_date)
const getRecentTransactions = async () => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT TOP 5
        p.payment_id,
        c.fullname       AS customerName,
        c.phone,
        b.tour_id        AS tourCode,
        b.booking_date   AS time,
        p.amount,
        p.status
      FROM Payment p
      INNER JOIN Booking  b ON p.booking_id = b.booking_id
      INNER JOIN Customer c ON b.cus_id     = c.cus_id
      ORDER BY b.booking_date DESC
    `);
    return result.recordset;
  } catch (error) {
    console.error("Lỗi khi lấy giao dịch gần đây:", error);
    throw new Error(ERROR_MESSAGES.API.SERVER_ERROR.message);
  }
};

// Lấy số liệu cho dashboard (4 chi nhánh có doanh thu cao nhất)
async function getBranchforDashboard() {
  try {
    // Kết nối đến SQL Server
    const pool = await sql.connect(dbConfig);

    const result = await pool.request().query(`
      WITH Revenue AS (
        SELECT b.branch_id, b.branch_name,
          SUM(CASE 
                WHEN YEAR(bo.booking_date)=YEAR(GETDATE()) 
                 AND MONTH(bo.booking_date)=MONTH(GETDATE()) 
                THEN p.amount ELSE 0 END) AS revenue_current,
          SUM(CASE 
                WHEN YEAR(bo.booking_date)=YEAR(DATEADD(MONTH,-1,GETDATE())) 
                 AND MONTH(bo.booking_date)=MONTH(DATEADD(MONTH,-1,GETDATE())) 
                THEN p.amount ELSE 0 END) AS revenue_previous
        FROM Booking bo
        JOIN Payment p ON bo.booking_id = p.booking_id
        JOIN Tour t    ON bo.tour_id    = t.tour_id
        JOIN Branch b  ON t.branch_id   = b.branch_id
        GROUP BY b.branch_id, b.branch_name
      ),
      TopBranches AS (
        SELECT TOP 4 
          branch_id, branch_name,
          revenue_current, revenue_previous,
          CASE 
            WHEN revenue_previous > 0 
            THEN ROUND((revenue_current - revenue_previous)*100.0/revenue_previous, 2) 
            ELSE 0 
          END AS growth
        FROM Revenue
        ORDER BY revenue_current DESC
      ),
      CancelRate AS (
        SELECT b.branch_id,
          COUNT(CASE WHEN bo.status='cancelled' THEN 1 END)*100.0/COUNT(*) AS cancel_rate
        FROM Booking bo
        JOIN Tour t   ON bo.tour_id    = t.tour_id
        JOIN Branch b ON t.branch_id   = b.branch_id
        GROUP BY b.branch_id
      ),
      TourCounts AS (
        SELECT branch_id, COUNT(*) AS total_tours
        FROM Tour
        GROUP BY branch_id
      )
      SELECT 
        tb.branch_id,
        tb.branch_name,
        tb.revenue_current   AS revenue,
        tb.growth            AS growth_percentage,
        cr.cancel_rate       AS cancel_rate,
        tc.total_tours       AS total_tours
      FROM TopBranches tb
      LEFT JOIN CancelRate cr ON cr.branch_id = tb.branch_id
      LEFT JOIN TourCounts tc ON tc.branch_id = tb.branch_id;
    `);

    return result.recordset;
  } catch (err) {
    console.error('Error in getBranchStats:', err);
    throw err;
  }
}

module.exports = {
  getOverviewStats,
  getBranchStats,
  getTourChartData,
  getRecentTransactions,
  getBranchforDashboard
};
