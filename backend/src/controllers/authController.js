const bcrypt = require('bcrypt'); // for password hashing
const jwt = require('jsonwebtoken'); // for JWT token
const { createEmployee, findEmployeeByName } = require('../models/employeeModel');

// Register a new employee
const register = async (req, res) => {
    try {
        const { name, role, weekly_wage, password } = req.body;

        // Check if employee already exists
        const existingEmployee = await findEmployeeByName(name);
        if (existingEmployee) {
            return res.status(400).json({ message: 'Employee already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create employee in database
        const employee = await createEmployee(name, role, weekly_wage, hashedPassword);

        res.status(201).json({ message: 'Employee registered successfully', employee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Employee login
const login = async (req, res) => {
    try {
        const { name, password } = req.body;

        // Find employee by name
        const employee = await findEmployeeByName(name);
        if (!employee) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: employee.id, role: employee.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login };