const {loginUser, registerUser, getUserInfo} = require("../services/authService");
const ERROR_MESSAGES = require("../utils/errorConstants");

const login = async (req, res) => {
    return loginUser(req, res);
}

const register = async (req, res) => {
    return registerUser(req, res);
}

const getUser = async (req, res) => {
    try {
        const { userId, role } = req.user; // Lấy từ authMiddleware
        const user = await getUserInfo(userId, role);
        return res.status(200).json({
            user,
        });
      } catch (error) {
        return res.status(500).json({
          code: ERROR_MESSAGES.API.SERVER_ERROR.code,
          message: error.message || ERROR_MESSAGES.API.SERVER_ERROR.message,
        });
      }
}


module.exports ={
    login, register, getUser
}