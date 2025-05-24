// backend/services/adminServices.js
// @author: Nguyễn Khắc Bảo : N22DCCN006 : n22dccn006@student.ptithcm.edu.vn

const { sql, getPool } = require("../config/db"); // Lấy kết nối DB và module mssql :contentReference[oaicite:0]{index=0}&#8203;:contentReference[oaicite:1]{index=1}
const ERROR_MESSAGES = require("../utils/errorConstants"); // Thông điệp lỗi chung :contentReference[oaicite:2]{index=2}&#8203;:contentReference[oaicite:3]{index=3}
const dbConfig = require('../config/db');  
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

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
        SELECT branch_id, branch_name FROM Branch;
    `);
    return result.recordset;
  }catch (error){
    console.error("Lỗi khi lấy tên của chi nhánh");
    throw new Error(ERROR_MESSAGES.API.SERVER_ERROR.message);
  }
};
// Lấy thông tin chi tiết chi nhánh theo ID
const getBranchDetail = async (branchId, year = new Date().getFullYear()) => {
  try {
    const pool = await getPool();
    
    // 1. Lấy thông tin cơ bản của chi nhánh
    const branchInfo = await pool.request()
      .input("branch_id", sql.Int, branchId)
      .query(`
        SELECT branch_id, branch_name, phone, address, status
        FROM Branch
        WHERE branch_id = @branch_id
      `);
    
    if (branchInfo.recordset.length === 0) {
      throw new Error(`Chi nhánh với ID ${branchId} không tồn tại`);
    }
    
    const branch = branchInfo.recordset[0];
    
    // 2. Lấy doanh thu theo từng tháng trong năm (theo start_date của Tour, chỉ tính booking confirmed)
    const revenueByMonth = await pool.request()
      .input("branch_id", sql.Int, branchId)
      .input("year", sql.Int, year)
      .query(`
        SELECT 
          MONTH(T.start_date) AS month,
          ISNULL(SUM(B.total_price), 0) AS revenue
        FROM Tour T
        LEFT JOIN Booking B ON T.tour_id = B.tour_id AND B.status = 'confirmed'
        WHERE T.branch_id = @branch_id
          AND YEAR(T.start_date) = @year
        GROUP BY MONTH(T.start_date)
        ORDER BY month
      `);
    
    // Tạo mảng doanh thu cho 12 tháng, điền 0 cho tháng không có dữ liệu
    const monthlyRevenue = Array(12).fill(0);
    revenueByMonth.recordset.forEach(item => {
      if (item.month) {
        monthlyRevenue[item.month - 1] = item.revenue;
      }
    });
    
    // 3. Lấy thống kê tour theo trạng thái
    const tourStats = await pool.request()
      .input("branch_id", sql.Int, branchId)
      .query(`
        SELECT
          COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_tours,
          COUNT(CASE WHEN status = 'active' THEN 1 END) AS active_tours,
          COUNT(CASE WHEN status = 'approved' THEN 1 END) AS approved_tours,
          COUNT(CASE WHEN status = 'rejected' THEN 1 END) AS rejected_tours,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_tours,
          COUNT(*) AS total_tours
        FROM Tour
        WHERE branch_id = @branch_id
      `);
    
    // 4. Lấy thống kê booking trong năm hiện tại
    const bookingStats = await pool.request()
      .input("branch_id", sql.Int, branchId)
      .input("year", sql.Int, year)
      .query(`
        SELECT
          COUNT(CASE WHEN B.status = 'confirmed' THEN 1 END) AS confirmed_bookings,
          COUNT(CASE WHEN B.status = 'pending' THEN 1 END) AS pending_bookings,
          COUNT(CASE WHEN B.status = 'canceled' THEN 1 END) AS canceled_bookings,
          COUNT(*) AS total_bookings,
          ISNULL(SUM(CASE WHEN B.status = 'confirmed' THEN B.total_price END), 0) AS total_revenue
        FROM Booking B
        INNER JOIN Tour T ON B.tour_id = T.tour_id
        WHERE T.branch_id = @branch_id
          AND YEAR(B.booking_date) = @year
      `);
    
    // 5. Lấy thống kê nhân viên
    const employeeStats = await pool.request()
      .input("branch_id", sql.Int, branchId)
      .query(`
        SELECT
          COUNT(CASE WHEN em_status = 'active' THEN 1 END) AS active_employees,
          COUNT(CASE WHEN em_status = 'inactive' THEN 1 END) AS inactive_employees,
          COUNT(*) AS total_employees
        FROM Employee
        WHERE branch_id = @branch_id
      `);
    
    // 6. Lấy top 5 tour có doanh thu cao nhất
    const topTours = await pool.request()
      .input("branch_id", sql.Int, branchId)
      .input("year", sql.Int, year)
      .query(`
        SELECT TOP 5
          T.tour_id,
          T.name AS tour_name,
          T.destination,
          COUNT(B.booking_id) AS total_bookings,
          ISNULL(SUM(B.total_price), 0) AS revenue
        FROM Tour T
        LEFT JOIN Booking B ON T.tour_id = B.tour_id AND B.status = 'confirmed'
        WHERE T.branch_id = @branch_id
          AND (B.booking_date IS NULL OR YEAR(B.booking_date) = @year)
        GROUP BY T.tour_id, T.name, T.destination
        ORDER BY revenue DESC
      `);
    
    // 7. Lấy danh sách các năm có dữ liệu để tạo bộ lọc năm
    const yearsData = await pool.request()
      .input("branch_id", sql.Int, branchId)
      .query(`
        SELECT DISTINCT YEAR(B.booking_date) AS year
        FROM Tour T
        INNER JOIN Booking B ON T.tour_id = B.tour_id
        WHERE T.branch_id = @branch_id
          AND B.booking_date IS NOT NULL
        ORDER BY year DESC
      `);
    
    const years = yearsData.recordset.map(item => item.year);
    // Thêm năm hiện tại nếu chưa có
    const currentYear = new Date().getFullYear();
    if (!years.includes(currentYear)) {
      years.unshift(currentYear);
    }
    
    // Kết hợp tất cả dữ liệu
    const tourStatsData = tourStats.recordset[0] || {};
    const bookingStatsData = bookingStats.recordset[0] || {};
    const employeeStatsData = employeeStats.recordset[0] || {};
    
    // Tính tỷ lệ hủy booking
    const totalBookingsCount = bookingStatsData.total_bookings || 0;
    const canceledBookingsCount = bookingStatsData.canceled_bookings || 0;
    const cancellationRate = totalBookingsCount > 0 ? 
      Math.round((canceledBookingsCount * 100) / totalBookingsCount) : 0;
    
    return {
      // Thông tin cơ bản chi nhánh
      branch_id: branch.branch_id,
      branch_code: `BR${branch.branch_id.toString().padStart(3, '0')}`,
      branch_name: branch.branch_name,
      phone: branch.phone,
      address: branch.address,
      status: branch.status,
      
      // Dữ liệu biểu đồ doanh thu
      months: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
      monthlyRevenue,
      years,
      selectedYear: year,
      
      // Thống kê tour
      tourStats: {
        pending: tourStatsData.pending_tours || 0,
        active: tourStatsData.active_tours || 0,
        approved: tourStatsData.approved_tours || 0,
        rejected: tourStatsData.rejected_tours || 0,
        completed: tourStatsData.completed_tours || 0,
        total: tourStatsData.total_tours || 0
      },
      
      // Thống kê booking
      bookingStats: {
        confirmed: bookingStatsData.confirmed_bookings || 0,
        pending: bookingStatsData.pending_bookings || 0,
        canceled: bookingStatsData.canceled_bookings || 0,
        total: bookingStatsData.total_bookings || 0,
        totalRevenue: bookingStatsData.total_revenue || 0,
        cancellationRate
      },
      
      // Thống kê nhân viên
      employeeStats: {
        active: employeeStatsData.active_employees || 0,
        inactive: employeeStatsData.inactive_employees || 0,
        total: employeeStatsData.total_employees || 0
      },
      
      // Top tour
      topTours: topTours.recordset || []
    };
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết chi nhánh:', error);
    throw new Error(`Không thể lấy chi tiết chi nhánh: ${error.message}`);
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
const getEmployeesByPageAndStatus = async (page, pageSize) => {
  const pool = await getPool();
  const offset = (page - 1) * pageSize;

  const result = await pool.request()
    .input("offset", offset)
    .input("pageSize", pageSize)
    .query(`
      SELECT 
      e.emp_id,
      e.fullname,
      e.role_id,
      e.email,
      e.phone,
      e.address,
      e.em_status,
      e.branch_id,
      r.role_name,
      b.branch_name
      FROM Employee e
      LEFT JOIN Branch b
        ON e.branch_id = b.branch_id
      LEFT JOIN Employee_Role r
         ON e.role_id = r.role_id  
      ORDER BY e.emp_id
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    `);

  return {
    employees: result.recordset,
    total: result.recordset[0]
  };
};

// Lấy thông tin nhân viên theo ID
const getEmployeeById = async (emp_id) => {
  const pool = await getPool();
  const result = await pool.request()
    .input("emp_id", sql.VarChar, emp_id)
    .query(`SELECT * FROM Employee WHERE emp_id = @emp_id`);
  return result.recordset[0];
};

// Lấy danh sách tour theo trạng thái và phân trang
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

// Khóa nhân viên theo danh sách ID
const lockEmployeesByIds = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("Danh sách IDs không hợp lệ");
  }
  const pool = await getPool();
  const request = pool.request();
  // Tạo tham số động: @id0,@id1,...
  const placeholders = ids.map((_, i) => `@id${i}`).join(",");
  ids.forEach((id, i) => {
    request.input(`id${i}`, sql.VarChar, id);
  });
  const result = await request.query(`
    UPDATE Employee
    SET em_status = 'inactive'
    WHERE emp_id IN (${placeholders})
  `);
  // rowsAffected[0] = số dòng bị update
  return result.rowsAffected[0];
};

// Khóa nhân viên theo danh sách ID
const unlockEmployeesByIds = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("Danh sách IDs không hợp lệ");
  }
  const pool = await getPool();
  const request = pool.request();
  // Tạo tham số động: @id0,@id1,...
  const placeholders = ids.map((_, i) => `@id${i}`).join(",");
  ids.forEach((id, i) => {
    request.input(`id${i}`, sql.VarChar, id);
  });
  const result = await request.query(`
    UPDATE Employee
    SET em_status = 'active'
    WHERE emp_id IN (${placeholders})
  `);
  // rowsAffected[0] = số dòng bị update
  return result.rowsAffected[0];
};

// Thêm chi nhánh mới
const createBranch = async ({ branch_name, address, phone, status='active' }) => {
  try {
    const pool = await getPool();
    await pool.request()
      .input('branch_name', sql.NVarChar, branch_name)
      .input('address', sql.NVarChar, address)
      .input('phone', sql.VarChar, phone)
      .input('status', sql.NVarChar, status)
      .query(`INSERT INTO Branch (branch_name, address, phone, status) VALUES (@branch_name, @address, @phone, @status)`);
  } catch (error) {
    console.error('Lỗi khi thêm chi nhánh mới:', error);
    
    throw new Error(error.message || 'Không thể thêm chi nhánh mới');
  }
};

const createEmployee = async ({ fullname, email, password, phone, address, role_id, branch_id }) => {
  const emp_id = uuidv4().replace(/-/g, "").slice(0, 10);
  const hire_day = new Date().toISOString().slice(0, 10);
  const em_status = 'active';
  const hashedPassword =Buffer.from( await hashPassword(password)); // dùng bcrypt
  const pool = await getPool();
  await pool.request()
    .input('emp_id', sql.VarChar, emp_id)
    .input('branch_id', sql.Int, branch_id)
    .input('fullname', sql.NVarChar, fullname)
    .input('email', sql.NVarChar, email)
    .input('password', sql.VarBinary, hashedPassword)
    .input('phone', sql.NVarChar, phone)
    .input('address', sql.NVarChar, address)
    .input('role_id', sql.Int, role_id)
    .input('hire_day', sql.Date, hire_day)
    .input('em_status', sql.NVarChar, em_status)
    .query(`INSERT INTO Employee (emp_id, branch_id, fullname, email, password, phone, address, role_id, hire_day, em_status)
            VALUES (@emp_id, @branch_id, @fullname, @email, @password, @phone, @address, @role_id, @hire_day, @em_status)`);
};

// Update thông tin nhân viên 
const updateEmployee = async (emp_id, { fullname, email, password, phone, address, role_id, branch_id }) => {
  const hashedPassword = Buffer.from(await hashPassword(password));
  const pool = await getPool();
  await pool.request()
    .input('emp_id', sql.VarChar, emp_id)
    .input('fullname', sql.NVarChar, fullname)
    .input('email', sql.NVarChar, email)
    .input('password', sql.VarBinary, hashedPassword)
    .input('phone', sql.NVarChar, phone)
    .input('address', sql.NVarChar, address)
    .input('role_id', sql.Int, role_id)
    .input('branch_id', sql.Int, branch_id)
    .query(`UPDATE Employee
            SET fullname = @fullname, email = @email, password = @password, phone = @phone, address = @address, role_id = @role_id, branch_id = @branch_id
            WHERE emp_id = @emp_id`);
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
  createBranch,
  createEmployee,
  lockEmployeesByIds,
  getBranchDetail,
  getEmployeeById,
  unlockEmployeesByIds,
  updateEmployee
};
