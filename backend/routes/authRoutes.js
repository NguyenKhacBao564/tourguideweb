const express = require("express");
const router = express.Router();
const { loginUser, registerUser } = require("../services/authService");

//config route
router.post("/login", loginUser);
router.post("/register", registerUser);


module.exports = router;