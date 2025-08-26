const pool = require('../config/db'); // import PostgreSQL pool

// Function to create a new employee
const createEmployee = async (name, role, weekly_wage, password) => {
    const query = `
        INSERT INTO employees (name, role, weekly_wage, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [name, role, weekly_wage, password];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Function to find an employee by name
const findEmployeeByName = async (name) => {
    const query = `SELECT * FROM employees WHERE name = $1`;
    const result = await pool.query(query, [name]);
    return result.rows[0];
};

// Function to find an employee by id
const findEmployeeById = async (id) => {
    const query = `SELECT * FROM employees WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

// Get all employees
const getAllEmployees = async () => {
    const query = `SELECT id, name, role, weekly_wage, created_at FROM employees`;
    const result = await pool.query(query);
    return result.rows;
};

// Update employee info
const updateEmployee = async (id, name, role, weekly_wage) => {
    const query = `
        UPDATE employees
        SET name = $1, role = $2, weekly_wage = $3
        WHERE id = $4
        RETURNING id, name, role, weekly_wage;
    `;
    const values = [name, role, weekly_wage, id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Delete employee
const deleteEmployee = async (id) => {
    const query = `DELETE FROM employees WHERE id = $1`;
    await pool.query(query, [id]);
    return true;
};

module.exports = {
    createEmployee,
    findEmployeeByName,
    findEmployeeById,
    getAllEmployees,
    updateEmployee,
    deleteEmployee,
};


