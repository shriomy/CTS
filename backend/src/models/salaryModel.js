const pool = require('../config/db');

// Create salary record
const createSalary = async (
    employee_id,
    week_start,
    week_end,
    gross_salary,
    deductions,
    allowances,
    advances,
    net_salary
) => {
    const query = `
        INSERT INTO salaries 
        (employee_id, week_start, week_end, gross_salary, deductions, allowances, advances, net_salary)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *;
    `;
    const values = [employee_id, week_start, week_end, gross_salary, deductions, allowances, advances, net_salary];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Get salary by employee
const getSalaryByEmployee = async (employee_id) => {
    const query = `SELECT * FROM salaries WHERE employee_id = $1 ORDER BY week_start DESC`;
    const result = await pool.query(query, [employee_id]);
    return result.rows;
};

// Get all salaries
const getAllSalaries = async () => {
    const query = `SELECT * FROM salaries ORDER BY week_start DESC`;
    const result = await pool.query(query);
    return result.rows;
};

module.exports = { createSalary, getSalaryByEmployee, getAllSalaries };
