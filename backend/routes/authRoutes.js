const express = require("express");
const router = express.Router();
const authController = require('../controller/authController');
const authMiddleware = require('../middlewares/authMiddlewares');

//config route
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/user', authMiddleware, authController.getUser);


module.exports = router;