// services/authService.js
const bcrypt = require("bcrypt");
const { sql, getPool } = require("../config/db");
const { generateAccessToken } = require("../middlewares/jwt");
const { v4: uuidv4 } = require("uuid");
const ERROR_MESSAGES = require("../utils/errorConstants");

const saltRounds = 10;

// Hàm xác thực mật khẩu
const verifyPassword = async (password, hashedPassword) => {
  // Nếu hashedPassword là Buffer (varbinary từ DB), chuyển thành chuỗi
  console.log("Đang xác thực mật khẩu...");
  const hashedPasswordString = Buffer.isBuffer(hashedPassword)
      ? hashedPassword.toString("utf8")
      : hashedPassword;
  return await bcrypt.compare(password, hashedPasswordString);
};


// Hàm lấy vai trò từ role_id
const getRoleById = async (roleId) => {
  console.log("Đang lấy vai trò từ role_id...");
  const pool = await getPool();
  const roleQuery = await pool
    .request()
    .input("roleId", sql.Int, roleId)
    .query("SELECT role_name FROM Employee_Role WHERE role_id = @roleId");

  const role = roleQuery.recordset[0]?.role_name;
  if (!role) throw new Error(`Không tìm thấy vai trò cho role_id: ${roleId}`);
  console.log("Lấy vai trò thành công:", role);
  return role;
};

//Hàm Hash password
const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  // Chuyển đổi hashedPassword thành Buffer
  const hashedBuffer = Buffer.from(hashedPassword, "utf8");
  return hashedBuffer;
}


// Hàm lấy thông tin user (cho endpoint /api/auth/me)
const getUserInfor = async (userId, role) => {
  try {
    const pool = await getPool();
    let user;

    if (role === "customer") {
      console.log("Đang lấy thông tin từ bảng Customer...");
      const result = await pool
        .request()
        .input("userId", sql.VarChar, userId)
        .query("SELECT * FROM Customer WHERE cus_id = @userId");
      user = result.recordset[0];
      if (!user) throw new Error("Không tìm thấy user trong bảng Customer");
      console.log("Đã tìm thấy user!");
      return {
        id: user.cus_id,
        name: user.fullname,
        email: user.email,
        phone: user.phone,
        role: "customer",
        address: user.address,
        avatar: user.pi_url,
      };
    } else {
      console.log("Đang lấy thông tin từ bảng Employee...");
      const result = await pool
        .request()
        .input("userId", sql.VarChar, userId)
        .query("SELECT * FROM Employee WHERE emp_id = @userId");
      user = result.recordset[0];
      if (!user) throw new Error("Không tìm thấy user trong bảng Employee");
      const roleName = await getRoleById(user.role_id);
      console.log("Đã tìm thấy user!");
      return {
        id: user.emp_id,
        name: user.fullname,
        email: user.email,
        phone: user.phone,
        role: roleName,
        address: user.address,
        avatar: user.pi_url,
        branch_id: user.branch_id,
      };
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin user:", error.message);
    throw new Error(error.message || "Lỗi server");
  }
};

// Hàm đăng nhập
const loginUser = async (email, password) => {
    if (!email || !password) {
      return {error: ERROR_MESSAGES.AUTH.LOGIN_FAILED}
    }
    ///Tạo kết nối đến database
    console.log("Đang kết nối đến database...");
    const pool = await getPool();

    // Hàm tìm kiếm người dùng trong bảng
    const checkUser = async (table, idField, roleField = null) => {
      console.log(`Đang kiểm tra trong bảng ${table}...`);
      const result = await pool
        .request()
        .input("email", sql.VarChar, email)
        .query(`SELECT ${idField}, ${roleField}, password FROM ${table} WHERE email = @email`);
      const user = result.recordset[0];
      if (!user) return null;
      //Kiểm tra mật khẩu
      const matchPassword = await verifyPassword(password, user.password);
      if (!matchPassword) {
        console.log("Mật khẩu không khớp!");
        return {error: ERROR_MESSAGES.AUTH.LOGIN_FAILED}
      }
      console.log("Xác thực mật khẩu thành công!")
      const role = roleField ? await getRoleById(user[roleField]) : "customer";
      return {
        id: user[idField],
        role: role,
      }
    }

    let user = await checkUser("Customer", "cus_id", null) || 
              await checkUser("Employee", "emp_id", "role_id");

    if(user?.error) return {error: user.error} 

    if(!user){
      console.log("Không tìm thấy user trong cả hai bảng!");
      return {error: ERROR_MESSAGES.AUTH.LOGIN_FAILED}
    }

    if (user) {
      const token = generateAccessToken({ userId: user.id, role: user.role});
      const userInfor = await getUserInfor(user.id, user.role);
     return {
        token: token, 
        userInfor: userInfor
     }
    }
};


// Hàm đăng ký
const registerUser = async (fullname, email, password, phone) => {
    if (!fullname || !email || !password || !phone) {
      return {error: ERROR_MESSAGES.AUTH.REGISTRATION_FAILED}
    }

    const pool = await getPool();
    //CODE KIỂM TRA EMAIL NÀY CHƯA TỐI ƯU SẼ SỬA LẠI SAU!!!!!
    // Kiểm tra email đã tồn tại trong bảng customer
    console.log("Đang kiểm tra email trong bảng Customer...")
    const emailCheck = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT cus_id FROM Customer WHERE email = @email");

    if (emailCheck.recordset.length > 0) {
      return {error: ERROR_MESSAGES.AUTH.REGISTRATION_FAILED}
    }

    // Kiểm tra email đã tồn tại trong bảng employee
    console.log("Đang kiểm tra email trong bảng Employee...")
    const emailCheckEmp = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT emp_id FROM Employee WHERE email = @email");
    if (emailCheckEmp.recordset.length > 0) {
      return {error: ERROR_MESSAGES.AUTH.REGISTRATION_FAILED}
    }

    // Tạo emp_id mới bằng uuid
    const cusID = uuidv4().replace(/-/g, "").slice(0, 10); // Lấy 10 ký tự đầu của UUID
    // Băm mật khẩu
    const hashedPassword = await hashPassword(password);
    //Thêm customer mới
    await pool
      .request()
      .input("cusID", sql.VarChar, cusID) // Sử dụng VarChar vì UUID là chuỗi
      .input("fullname", sql.NVarChar, fullname)
      .input("email", sql.NVarChar, email)
      .input("password", sql.VarBinary, hashedPassword)
      .input("phone", sql.NVarChar, phone)
      .query(
        "INSERT INTO Customer (cus_id, fullname, email, password, phone) VALUES (@cusID, @fullname, @email, @password, @phone)"
      );
    // Tạo token cho người dùng
    const token = generateAccessToken({ userId: cusID, role: "customer" });
    const userInfor = await getUserInfor(cusID, "customer");
    return {
      token: token,
      userInfor: userInfor,
      message: "Đăng ký thành công",
    };
};

module.exports = { loginUser, registerUser, getUserInfor };