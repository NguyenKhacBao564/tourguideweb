// services/authService.js
const bcrypt = require("bcrypt");
const { sql, getPool } = require("../config/db");
const { generateToken } = require("../utils/jwt");
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
const getUserInfo = async (userId, role) => {
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
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Đang đăng nhập với email:", email, "và mật khẩu:", password);
    if (!email || !password) {
      return res.status(400).json({
        code: ERROR_MESSAGES.AUTH.LOGIN_FAILED.code,
        message: "Email và mật khẩu là bắt buộc"
      });
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
        .query(`SELECT * FROM ${table} WHERE email = @email`);
      const user = result.recordset[0];
      if (!user) return null;
      const matchPassword = await verifyPassword(password, user.password);
      if (!matchPassword) {
        console.log("Mật khẩu không khớp!")
        return { error: ERROR_MESSAGES.AUTH.LOGIN_FAILED };
      }
      console.log("Xác thực mật khẩu thành công!")
      const role = roleField ? await getRoleById(user[roleField]) : "customer";
      return {
        id: user[idField],
        role: role,
      }
    }

    // 1. Kiểm tra trong bảng Customer
    console.log("Đang kiểm tra trong bảng Customer...");
    let user = await checkUser("Customer", "cus_id", null);
    if (user?.error) {
      return res.status(401).json({
        code: user.error.code,
        message: user.error.message
      });
    }
    if (user) {
      const token = generateToken({ userId: user.id, role: user.role });
      return res.status(200).json({
        token,
        message: "Đăng nhập thành công",
      });
    }
    // 2. Kiểm tra trong bảng Employee
    console.log("Đang kiểm tra trong bảng Employee...");
    user = await checkUser("Employee", "emp_id", "role_id");
    if (user?.error) {
      return res.status(401).json({
        code: user.error.code,
        message: user.error.message
      });
    }

    if (user){
      const token = generateToken({userId: user.id, role: user.role});
      return res.status(200).json({
        token,
        message: "Đăng nhập thành công",
      });
    }

    console.log("Không tìm thấy user");
    // Nếu không tìm thấy user
    return res.status(401).json({
      code: ERROR_MESSAGES.AUTH.LOGIN_FAILED.code,
      message: ERROR_MESSAGES.AUTH.LOGIN_FAILED.message
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error.message);
    return res.status(500).json({
      code: ERROR_MESSAGES.API.SERVER_ERROR.code,
      message: ERROR_MESSAGES.API.SERVER_ERROR.message
    });
  }
};

// Hàm đăng ký
const registerUser = async (req, res) => {
  try {
    const { fullname, email, password, phone } = req.body;
    if (!fullname || !email || !password || !phone) {
      return res.status(400).json({
        code: ERROR_MESSAGES.AUTH.REGISTRATION_FAILED.code,
        message: "Vui lòng điền đầy đủ thông tin"
      });
    }
    const pool = await getPool();

    //CODE KIỂM TRA EMAIL NÀY CHƯA TỐI ƯU SẼ SỬA LẠI SAU!!!!!
    // Kiểm tra email đã tồn tại trong bảng customer
    console.log("Đang kiểm tra email trong bảng Customer...")
    const emailCheck = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Customer WHERE email = @email");

    
    if (emailCheck.recordset.length > 0) {
      return res.status(400).json({
        code: ERROR_MESSAGES.AUTH.REGISTRATION_FAILED.code,
        message: ERROR_MESSAGES.AUTH.REGISTRATION_FAILED.message
      });
    }

    // Kiểm tra email đã tồn tại trong bảng employee
    console.log("Đang kiểm tra email trong bảng Employee...")
    const emailCheckEmp = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Employee WHERE email = @email");
    if (emailCheckEmp.recordset.length > 0) {
      return res.status(400).json({
        code: ERROR_MESSAGES.AUTH.REGISTRATION_FAILED.code,
        message: ERROR_MESSAGES.AUTH.REGISTRATION_FAILED.message
      });
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
    const token = generateToken({ userId: cusID, role: "customer" });
    return res.status(201).json({
      token,
      message: "Đăng ký thành công",
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error.message);
    return res.status(500).json({
      code: ERROR_MESSAGES.API.SERVER_ERROR.code,
      message: ERROR_MESSAGES.API.SERVER_ERROR.message
    });
  }
};

module.exports = { loginUser, registerUser, getUserInfo };