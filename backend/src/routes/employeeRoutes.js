const express = require('express');
const router = express.Router();
const {
    listEmployees,
    editEmployee,
    removeEmployee,
    getEmployee,
} = require('../controllers/employeeController');
const authenticateToken = require('../middleware/authMiddleware');
const roleAuth = require('../middleware/roleAuth');

// Protect all routes
router.use(authenticateToken);

// Get all employees (manager only)
router.get('/', roleAuth('manager'), listEmployees);

// Get employee by ID
router.get('/:id', getEmployee);

// Update employee (manager only)
router.put('/:id', roleAuth('manager'), editEmployee);

// Delete employee (manager only)
router.delete('/:id', roleAuth('manager'), removeEmployee);

module.exports = router;