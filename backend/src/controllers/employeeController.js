const {
    getAllEmployees,
    updateEmployee,
    deleteEmployee,
    findEmployeeById,
} = require('../models/employeeModel');

// Get all employees
const listEmployees = async (req, res) => {
    try {
        const employees = await getAllEmployees();
        res.json({ employees });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update employee
const editEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, weekly_wage } = req.body;

        const updatedEmployee = await updateEmployee(id, name, role, weekly_wage);
        res.json({ message: 'Employee updated', employee: updatedEmployee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete employee
const removeEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteEmployee(id);
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get employee by ID
const getEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await findEmployeeById(id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json({ employee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { listEmployees, editEmployee, removeEmployee, getEmployee };
