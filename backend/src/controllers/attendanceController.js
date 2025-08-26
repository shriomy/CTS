const pool = require('../config/db');

// Mark attendance
const recordAttendance = async (req, res) => {
    try {
        const { employee_id, date, hours_worked } = req.body;
        
        // Determine attendance type
        let attendance_type;
        if (hours_worked >= 8) attendance_type = 'full';
        else if (hours_worked >= 4) attendance_type = 'half';
        else attendance_type = 'third';

        const query = `
            INSERT INTO attendance (employee_id, date, hours_worked, attendance_type)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        
        const values = [employee_id, date, hours_worked, attendance_type];
        const result = await pool.query(query, values);
        
        res.status(201).json({ message: 'Attendance recorded successfully', attendance: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get attendance for one employee
const viewAttendance = async (req, res) => {
    try {
        const { employee_id } = req.params;
        const query = `SELECT * FROM attendance WHERE employee_id = $1 ORDER BY date DESC`;
        const result = await pool.query(query, [employee_id]);
        
        res.json({ attendance: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all attendance (manager view)
const viewAllAttendance = async (req, res) => {
    try {
        const query = `
            SELECT a.*, e.name as employee_name 
            FROM attendance a 
            JOIN employees e ON a.employee_id = e.id 
            ORDER BY date DESC
        `;
        const result = await pool.query(query);
        
        res.json({ attendance: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { recordAttendance, viewAttendance, viewAllAttendance };