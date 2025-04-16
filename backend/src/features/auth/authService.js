// backend/src/features/auth/authService.js

const { sql, getPool } = require('../../config/database');

/**
 * Kiểm tra đăng nhập bằng email và password (plain text).
 * Thực tế nên dùng hash & salt (bcrypt).
 */
async function loginByEmailPassword(email, password) {
  const pool = await getPool();
  
  // Giả sử bảng [Users] có cột [email], [password] (chưa mã hoá)
  const customerResult = await pool.request()
    .input('email', sql.NVarChar, email)
    .input('password', sql.VarBinary, password)
    .query(`
      SELECT 'customer' AS role,cus_id, fullname, email, address, phone, age, cus_status
      FROM Customer
      WHERE email = @email AND password = @password;
    `);
    //WHERE email = @email AND password = HASHBYTES('SHA2_256',@password)
  if (customerResult.recordset.length > 0) {
    console.log("This is customer's account");
    return customerResult.recordset[0];
  }
  const employeeResult = await pool.request()
    .input('email', sql.NVarChar, email)
    .input('password', sql.VarBinary, password)
    .query(`
      SELECT er.role_name AS role, emp_id AS user_id, full_name
      FROM Employee
      INNER JOIN Employee_Role er ON Employee.role_id = er.role_id
      WHERE email = @email AND password = @password;
    `);
  if (employeeResult.recordset.length > 0) {
    console.log("This is employee's account");
    console.log(employeeResult.recordset[0]);
    return employeeResult.recordset[0];
  }
  // Lấy user đầu tiên
  console.log("Can't find any account");
  return null;
}

module.exports = {
  loginByEmailPassword
};
// SELECT emp_id, fullname, brand_id, email, phone, em_status, role_id, hire_date
// FROM Employee
// WHERE email = @email AND password = @password; 