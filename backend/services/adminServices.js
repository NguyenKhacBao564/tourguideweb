// backend/services/adminServices.js
// @author: Nguyễn Khắc Bảo : N22DCCN006 : n22dccn006@student.ptithcm.edu.vn

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
        (SELECT COUNT(*) FROM Customer WHERE cus_status='active')         AS totalCustomers,
        (SELECT COUNT(*) FROM Tour)             AS totalTours
    `);
    return result.recordset[0];
  } catch (error) {
    console.error("Lỗi khi lấy số liệu tổng quan:", error);
    throw new Error(ERROR_MESSAGES.API.SERVER_ERROR.message);
  }
};

// Hàm lấy thông tin của chi nhánh
const getBranch = async ()=>{
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT branch_name 
          FROM Branch;
    `);
    return result.recordset[0];
  }catch (error){
    console.error("Lỗi khi lấy tên của chi nhánh");
    throw new Error(ERROR_MESSAGES.API.SERVER_ERROR.message);
  }
};

// Lấy số tour theo từng chi nhánh
async function getBranchStats() {
  try {
      let pool = await sql.connect(dbConfig);

      // Thống kê chi nhánh (Doanh thu, Tăng trưởng, Tỷ lệ hủy, Tổng số tour)
      const branchStats = await pool.request()
          .query(`
              WITH BranchRevenue AS (
                  -- Doanh thu tháng hiện tại của mỗi chi nhánh
                  SELECT 
                      B.branch_id,
                      B.branch_name,
                      COALESCE(SUM(Bk.total_price), 0) AS current_revenue
                  FROM Branch B
                  LEFT JOIN Tour T ON B.branch_id = T.branch_id
                  LEFT JOIN Booking Bk ON T.tour_id = Bk.tour_id AND Bk.status = 'confirmed'
                      AND FORMAT(Bk.booking_date, 'yyyy-MM') = FORMAT(GETDATE(), 'yyyy-MM')
                  GROUP BY B.branch_id, B.branch_name
              ),
              PreviousRevenue AS (
                  -- Doanh thu tháng trước của mỗi chi nhánh
                  SELECT 
                      B.branch_id,
                      COALESCE(SUM(Bk.total_price), 0) AS previous_revenue
                  FROM Branch B
                  LEFT JOIN Tour T ON B.branch_id = T.branch_id
                  LEFT JOIN Booking Bk ON T.tour_id = Bk.tour_id AND Bk.status = 'confirmed'
                      AND FORMAT(Bk.booking_date, 'yyyy-MM') = FORMAT(DATEADD(MONTH, -1, GETDATE()), 'yyyy-MM')
                  GROUP BY B.branch_id
              ),
              CancellationStats AS (
                  -- Tỷ lệ hủy của mỗi chi nhánh
                  SELECT 
                      B.branch_id,
                      COUNT(CASE WHEN Bk.status = 'canceled' THEN 1 END) AS canceled_count,
                      COUNT(Bk.booking_id) AS total_bookings
                  FROM Branch B
                  LEFT JOIN Tour T ON B.branch_id = T.branch_id
                  LEFT JOIN Booking Bk ON T.tour_id = Bk.tour_id
                  GROUP BY B.branch_id
              ),
              TourCount AS (
                  -- Tổng số tour của mỗi chi nhánh
                  SELECT 
                      B.branch_id,
                      COUNT(T.tour_id) AS total_tours
                  FROM Branch B
                  LEFT JOIN Tour T ON B.branch_id = T.branch_id
                  GROUP BY B.branch_id
              )
              SELECT 
                  BR.branch_id,
                  BR.branch_name,
                  BR.current_revenue AS revenue,
                  CASE 
                      WHEN PR.previous_revenue = 0 THEN 0
                      ELSE ROUND(((BR.current_revenue - PR.previous_revenue) * 100.0 / PR.previous_revenue), 2)
                  END AS growth_percentage,
                  CASE 
                      WHEN CS.total_bookings = 0 THEN 0
                      ELSE ROUND((CS.canceled_count * 100.0 / CS.total_bookings), 2)
                  END AS cancellation_rate,
                  TC.total_tours
              FROM BranchRevenue BR
              LEFT JOIN PreviousRevenue PR ON BR.branch_id = PR.branch_id
              LEFT JOIN CancellationStats CS ON BR.branch_id = CS.branch_id
              LEFT JOIN TourCount TC ON BR.branch_id = TC.branch_id;
          `);
      //console.log('Branch Stats:', branchStats.recordset);
      return branchStats.recordset;
  } catch (error) {
      console.error('Lỗi khi lấy thống kê chi nhánh:', error);
      throw new Error('Không thể lấy thống kê chi nhánh');
  } finally {
      //sql.close();
  }
}

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

// Lấy nhân viên phân trang + lọc status
const getEmployeesByPageAndStatus = async (status, page, pageSize) => {
  const pool = await getPool();
  const offset = (page - 1) * pageSize;

  const result = await pool.request()
    .input("status", status)
    .input("offset", offset)
    .input("pageSize", pageSize)
    .query(`
      SELECT * FROM Employee 
      WHERE em_status = @status
      ORDER BY emp_id
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    `);

  const countResult = await pool.request()
    .input("status", status)
    .query(`SELECT COUNT(*) AS total FROM Employee WHERE em_status = @status`);
  // console.log(result.recordset);
  // console.log(countResult.recordset[0].total);
  return {
    employees: result.recordset,
    total: countResult.recordset[0].total
  };
};

const getToursByStatusAndPage = async ( page, pageSize) => {
  const status = 'active'; // Trạng thái tour mặc định là 'active'
  try {
    const pool = await getPool();
    const offset = (page - 1) * pageSize;

    // 1) Lấy dữ liệu
    const result = await pool.request()
      .input('status', sql.NVarChar, status)
      .input('offset', sql.Int, offset)
      .input('pageSize', sql.Int, pageSize)
      .query(`
        SELECT *
        FROM Tour
        WHERE status = @status
        ORDER BY created_at DESC
        OFFSET @offset ROWS
        FETCH NEXT @pageSize ROWS ONLY
      `);

    // 2) Lấy tổng
    const countRes = await pool.request()
      .input('status', sql.NVarChar, status)
      .query(`SELECT COUNT(*) AS total FROM Tour WHERE status = @status`);

    const total = countRes.recordset[0].total;
    const tours = result.recordset;
    return { tours, total };
  } catch (err) {
    console.error('Lỗi getToursByStatusAndPage:', err);
    throw err;
  }
};

// Duyệt tour theo ID
const approveTourById = async (tourId) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('tourId', sql.NVarChar, tourId)
      .query(`
        UPDATE Tour
        SET status = 'approved'
        WHERE tour_id = @tourId
      `);
    if (result.rowsAffected[0] === 0) {
      throw new Error('Không tìm thấy tour để duyệt');
    }
    return;
  } catch (err) {
    console.error('Lỗi khi duyệt tour:', err);
    throw err;
  }
};

// Từ chối tour theo ID
const rejectTourById = async (tourId) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('tourId', sql.NVarChar, tourId)
      .query(`
        UPDATE Tour
        SET status = 'rejected'
        WHERE tour_id = @tourId
      `);
    if (result.rowsAffected[0] === 0) {
      throw new Error('Không tìm thấy tour để từ chối');
    }
    return;
  } catch (err) {
    console.error('Lỗi khi từ chối tour:', err);
    throw err;
  }
};

module.exports = {
  approveTourById,
  rejectTourById,
  getOverviewStats,
  getBranchStats,
  getTourChartData,
  getRecentTransactions,
  getEmployeesByPageAndStatus,
  getBranch,
  getToursByStatusAndPage,
};
