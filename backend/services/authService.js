// services/authService.js
const bcrypt = require("bcrypt");
const { sql, poolPromise } = require("../config/db");
const { generateToken } = require("../utils/jwt");
const { v4: uuidv4 } = require("uuid");
const saltRounds = 10;

// Hàm xác thực mật khẩu
const verifyPassword = async (password, hashedPassword) => {
  // Nếu hashedPassword là Buffer (varbinary từ DB), chuyển thành chuỗi
  console.log("Đang xác thực mật khẩu...");
  const hashedPasswordString =
    Buffer.isBuffer(hashedPassword)
      ? hashedPassword.toString("utf8")
      : hashedPassword;

  const match = await bcrypt.compare(password, hashedPasswordString);
  if (!match) {
    return false; // Hoặc ném lỗi nếu cần
  }
  console.log("Xác thực mật khẩu thành công");
  return true;
};


// Hàm lấy vai trò từ role_id
const getRoleById = async (roleId) => {
  console.log("Đang lấy vai trò từ role_id...");
  const pool = await poolPromise;
  const roleQuery = await pool
    .request()
    .input("roleId", sql.Int, roleId)
    .query("SELECT role_name FROM Employee_Role WHERE role_id = @roleId");

  const role = roleQuery.recordset[0]?.role_name;
  if (!role) {
    throw new Error(`Không tìm thấy vai trò cho role_id: ${roleId}`);
  }
  console.log("Lấy vai trò thành công:", role);
  return role; 
};

//Hàm Hash password
const hashPassword = async (password) => {
  let hashedPassword = await bcrypt.hash(password, saltRounds);
  // Chuyển đổi hashedPassword thành Buffer
  let hashedBuffer = Buffer.from(hashedPassword, "utf8");
  return hashedBuffer;
}

// Hàm đăng nhập
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });
    }
    ///Tạo kết nối đến database
    console.log("Đang kết nối đến database...");
    const pool = await poolPromise;

    // Hàm tìm kiếm người dùng trong bảng
    const checkUser = async (table, idField, roleField = null) => {
      console.log(`Đang kiểm tra trong bảng ${table}...`);
      const result = await pool
        .request()
        .input("email", sql.VarChar, email)
        .query(`SELECT * FROM ${table} WHERE email = @email`);
      const user = result.recordset[0];
      if(!user) return null;
      const matchPassword = await verifyPassword(password, user.password);
      if (!matchPassword) {
        return { error: "Mật khẩu không đúng" };
      }
      const role = roleField ? await getRoleById(user[roleField]) : "customer";
      return{
        id: user[idField],
        name: user.fullname,
        email: user.email,
        role: role,
      }
    }

    // 1. Kiểm tra trong bảng Customer
    console.log("Đang kiểm tra trong bảng Customer...");
    let user = await checkUser("Customer", "cus_id", null);
    if(user?.error){
      res.status(401).json({ message: user.error });
    }
    if (user) {
      const token = generateToken({ userId: user.id, role: user.role , name: user.name});
      return res.status(200).json({
        token,
        message: "Đăng nhập thành công",
        user,
      });
    }
    // 2. Kiểm tra trong bảng Employee
    console.log("Đang kiểm tra trong bảng Employee...");
    user = await checkUser("Employee", "emp_id", "role_id");
    if(user?.error){
      res.status(401).json({ message: user.error });
    }
    if (user){
      const token = generateToken({userId: user.id, role: user.role , name: user.name });
      return res.status(200).json({
        token,
        message: "Đăng nhập thành công",
        user,
      });
    }
    // Nếu không tìm thấy user
    return res.status(401).json({ message: "Email hoặc mật khẩu không đúng [Không tìm thấy email]" });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error.message);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

// Hàm đăng ký
const registerUser = async (req, res) => {
  try {
    const { fullname, email, password, phone } = req.body;
    if (!fullname || !email || !password || !phone) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }
    const pool = await poolPromise;
    // Kiểm tra email đã tồn tại trong bảng customer
    const emailCheck = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Customer WHERE email = @email");

    if (emailCheck.recordset.length > 0) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    // Tạo emp_id mới bằng uuid
    const cusID = uuidv4().replace(/-/g, "").slice(0, 10); // Lấy 10 ký tự đầu của UUID
    // Băm mật khẩu
    const hashedPassword = await hashPassword(password);
    // Thêm employee mới
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
    const token = generateToken({ userId: cusID, role: "customer" , name: fullname});
    return res.status(201).json({
      token,
      message: "Đăng ký thành công",
      user: {
        id: cusID,
        name: fullname,
        email: email,
        role: "customer",
      },
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error.message);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

module.exports = { loginUser, registerUser };