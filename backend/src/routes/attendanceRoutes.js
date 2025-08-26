const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authenticateToken = require('../middleware/authMiddleware');
const roleAuth = require('../middleware/roleAuth');

// Middleware to protect routes
router.use(authenticateToken);

// Mark attendance (manager only)
router.post('/mark', roleAuth('manager'), async (req, res) => {
    try {
        const { employee_id, date, hours_worked } = req.body;
        
        // Determine attendance type
        let attendance_type;
        if (hours_worked >= 8) attendance_type = 'full';
        else if (hours_worked >= 4) attendance_type = 'half';
        else attendance_type = 'third';

        const result = await pool.query(
            'INSERT INTO attendance (employee_id, date, hours_worked, attendance_type) VALUES ($1, $2, $3, $4) RETURNING *',
            [employee_id, date, hours_worked, attendance_type]
        );

        res.json({ message: 'Attendance recorded successfully', attendance: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get attendance for a specific employee
router.get('/employee/:employee_id', async (req, res) => {
    try {
        const { employee_id } = req.params;
        const result = await pool.query(
            'SELECT * FROM attendance WHERE employee_id = $1 ORDER BY date DESC',
            [employee_id]
        );

        res.json({ attendance: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all attendance (manager only)
router.get('/', roleAuth('manager'), async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT a.*, e.name as employee_name FROM attendance a JOIN employees e ON a.employee_id = e.id ORDER BY a.date DESC'
        );

        res.json({ attendance: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;