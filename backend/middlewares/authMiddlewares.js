// middleware/authMiddleware.js
const { verifyToken } = require('../utils/jwt');
const ERROR_MESSAGES = require('../utils/errorConstants');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        code: ERROR_MESSAGES.AUTH.INVALID_TOKEN.code,
        message: 'No token provided',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      code: ERROR_MESSAGES.AUTH.INVALID_TOKEN.code,
      message: 'Invalid token',
      error: error.message,
    });
  }
};

module.exports = authMiddleware;