const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Register a new employee (manager only)
router.post('/register', register);

// Employee login
router.post('/login', login);

module.exports = router;