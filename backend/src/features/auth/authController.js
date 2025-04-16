// backend/src/features/auth/authController.js
const authService = require('./authService');
// const bcrypt = require('bcrypt');

// async function hashPassword(password) {
//   const saltRounds = 10; // Số vòng băm, giá trị càng cao thì càng an toàn nhưng tốn tài nguyên
//   const hashedPassword = await bcrypt.hash(password, saltRounds);
//   return hashedPassword;
// }
const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha256') // SHA2_256
               .update(password, 'utf8') // Mã hóa input là UTF-8
               .digest('hex') // Xuất ra dạng HEX (giống MSSQL)
               .toUpperCase(); // MSSQL xuất ra dạng chữ in hoa
}
/**
 *
 * Xử lý đăng nhập (POST /api/auth/login)
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Thiếu email hoặc password' });
    }
    // Test xem email và password có lấy được không
    console.log(email);
    console.log(password);

    // Mã hoá password trước khi kiểm tra
    const hashedpassword=(hashPassword(password));
    const hashedBuffer = Buffer.from(hashedpassword, 'hex');

    // Test xem password đã mã hoá được chưa
    console.log(hashedBuffer);

    // Gọi service kiểm tra DB
    const user = await authService.loginByEmailPassword(email, hashedBuffer);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Sai email hoặc password' });
    }

    // Tạo token (JWT) hoặc session (tùy). Ở đây demo trả về JSON.
    // Giả sử ta trả "fakeToken" thay cho JWT thật:
    const fakeToken = `FAKE-TOKEN-USERID-${user.user_id}`;

    return res.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: {
        user_id: user.user_id,
        message: 'Login successful',
        full_name: user.full_name || user.fullname,
        role: user.role
      },
      token: fakeToken
    });
  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
}

module.exports = {
  login
};
