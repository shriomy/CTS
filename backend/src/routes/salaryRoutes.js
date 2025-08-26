const express = require('express');
const router = express.Router();
const {
    calculateSalary,
    viewSalaries,
    viewAllSalaries
} = require('../controllers/salaryController');
const authenticateToken = require('../middleware/authMiddleware');
const roleAuth = require('../middleware/roleAuth');

router.use(authenticateToken);

// Calculate salary (manager only)
router.post('/calculate', roleAuth('manager'), calculateSalary);

// Get salaries for one employee
router.get('/employee/:employee_id', viewSalaries);

// Get all salaries (manager only)
router.get('/', roleAuth('manager'), viewAllSalaries);

module.exports = router;