// services/authService.js
const bcrypt = require("bcrypt");
const { sql, getPool } = require("../config/db");
const { generateToken } = require("../utils/jwt");
const { v4: uuidv4 } = require("uuid");
const saltRounds = 10;
const ERROR_MESSAGES = require("../utils/errorConstants");

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
    console.log("Mật khẩu không đúng");
    return false; // Hoặc ném lỗi nếu cần
  }
  console.log("Xác thực mật khẩu thành công");
  return true;
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
      if(!user) return null;
      const matchPassword = await verifyPassword(password, user.password);
      if (!matchPassword) {
        return { error: ERROR_MESSAGES.AUTH.LOGIN_FAILED };
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
      return res.status(401).json({ 
        code: user.error.code,
        message: user.error.message 
      });
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
      return res.status(401).json({ 
        code: user.error.code,
        message: user.error.message 
      });
    }
    if (user){
      const token = generateToken({userId: user.id, role: user.role , name: user.name });
      return res.status(200).json({
        token,
        message: "Đăng nhập thành công",
        user,
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
    // Kiểm tra email đã tồn tại trong bảng customer
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
    return res.status(500).json({ 
      code: ERROR_MESSAGES.API.SERVER_ERROR.code,
      message: ERROR_MESSAGES.API.SERVER_ERROR.message 
    });
  }
  //Thêm employee mới
    // await pool
    // .request()
    // .input("empId", sql.Int, 19) // Sử dụng VarChar vì UUID là chuỗi
    // .input("fullname", sql.NVarChar, fullname)
    // .input("email", sql.NVarChar, email)
    // .input("password", sql.VarBinary, hashedPassword)
    // .input("phone", sql.NVarChar, phone)
    // .input("roleid", sql.Int, 3)
    // .input("branchid", sql.Int, 1)
    // .query(
    //   "INSERT INTO Employee (emp_id, fullname, email, password, phone, role_id, branch_id) VALUES (@empId, @fullname, @email, @password, @phone, @roleid, @branchid )"
    // );
    // // Tạo token cho người dùng
    // const token = generateToken({ userId: cusID, role: "Sales" , name: fullname});
    // return res.status(201).json({
    //   token,
    //   message: "Đăng ký thành công",
    //   user: {
    //     id: cusID,
    //     name: fullname,
    //     email: email,
    //     role: "Sales",
    //   },
    // });
    // } catch (error) {
    // console.error("Lỗi đăng ký:", error.message);
    // return res.status(500).json({ message: error.message || "Lỗi server" });
    // }
};

module.exports = { loginUser, registerUser };