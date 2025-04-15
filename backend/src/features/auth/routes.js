// backend/src/features/auth/routes.js
const express = require('express');
const router = express.Router();
const authController = require('./authController');

// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;
router.get('/', (req, res) => {
    res.json({ message: 'Auth API is working' });
});
