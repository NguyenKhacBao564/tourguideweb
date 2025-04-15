
const jwt = require("jsonwebtoken");

const JWT_SECRET = "f9J@1c$hX72L!b6Zq*9T&dA7vE0mNpR#";

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

module.exports = { generateToken, JWT_SECRET };