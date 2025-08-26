const pool = require('../config/db');

// Mark attendance
const markAttendance = async (employee_id, date, hours_worked, attendance_type) => {
    const query = `
        INSERT INTO attendance (employee_id, date, hours_worked, attendance_type)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [employee_id, date, hours_worked, attendance_type];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Get attendance by employee
const getAttendanceByEmployee = async (employee_id) => {
    const query = `SELECT * FROM attendance WHERE employee_id = $1 ORDER BY date DESC`;
    const result = await pool.query(query, [employee_id]);
    return result.rows;
};

// Get all attendance (manager view)
const getAllAttendance = async () => {
    const query = `SELECT * FROM attendance ORDER BY date DESC`;
    const result = await pool.query(query);
    return result.rows;
};

module.exports = { markAttendance, getAttendanceByEmployee, getAllAttendance };
