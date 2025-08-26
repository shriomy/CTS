const { createSalary, getSalaryByEmployee, getAllSalaries } = require('../models/salaryModel');
const pool = require('../config/db');

// Calculate salary based on attendance, weekly wage, allowances, deductions, advances
const calculateSalary = async (req, res) => {
    try {
        const { employee_id, week_start, week_end } = req.body;

        // 1. Get employee info
        const employeeResult = await pool.query(`SELECT weekly_wage FROM employees WHERE id = $1`, [employee_id]);
        if (employeeResult.rows.length === 0) return res.status(404).json({ message: 'Employee not found' });
        const weeklyWage = parseFloat(employeeResult.rows[0].weekly_wage);

        // 2. Get attendance for the week
        const attendanceResult = await pool.query(
            `SELECT hours_worked, attendance_type FROM attendance WHERE employee_id=$1 AND date BETWEEN $2 AND $3`,
            [employee_id, week_start, week_end]
        );
        const attendance = attendanceResult.rows;

        if (attendance.length === 0) return res.status(400).json({ message: 'No attendance found for this week' });

        // 3. Calculate gross salary
        // Assume 8 hours per full day; calculate proportional wage
        let totalHours = 0;
        attendance.forEach(a => totalHours += parseFloat(a.hours_worked));
        const dailyHours = 8;
        const daysInWeek = 5; // Assuming 5-day work week
        const grossSalary = (totalHours / (daysInWeek * dailyHours)) * weeklyWage;

        // 4. Get allowances (bonus, incentives) for employee this week
        const allowanceResult = await pool.query(
            `SELECT COALESCE(SUM(amount),0) as total_allowances FROM allowances WHERE employee_id=$1 AND date BETWEEN $2 AND $3`,
            [employee_id, week_start, week_end]
        );
        const totalAllowances = parseFloat(allowanceResult.rows[0].total_allowances);

        // 5. Get deductions (ETF/PTF, losses, credits)
        const deductionResult = await pool.query(
            `SELECT COALESCE(SUM(amount),0) as total_deductions FROM deductions WHERE employee_id=$1 AND date BETWEEN $2 AND $3`,
            [employee_id, week_start, week_end]
        );
        const totalDeductions = parseFloat(deductionResult.rows[0].total_deductions);

        // 6. Get advances
        const advanceResult = await pool.query(
            `SELECT COALESCE(SUM(amount),0) as total_advances FROM advances WHERE employee_id=$1 AND week_held=$2`,
            [employee_id, week_start]
        );
        const totalAdvances = parseFloat(advanceResult.rows[0].total_advances);

        // 7. Net salary
        const netSalary = grossSalary + totalAllowances - totalDeductions - totalAdvances;

        // 8. Save salary record
        const salaryRecord = await createSalary(
            employee_id,
            week_start,
            week_end,
            grossSalary,
            totalDeductions,
            totalAllowances,
            totalAdvances,
            netSalary
        );

        res.json({ message: 'Salary calculated', salary: salaryRecord });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get salaries for one employee
const viewSalaries = async (req, res) => {
    try {
        const { employee_id } = req.params;
        const salaries = await getSalaryByEmployee(employee_id);
        res.json({ salaries });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all salaries (manager view)
const viewAllSalaries = async (req, res) => {
    try {
        const salaries = await getAllSalaries();
        res.json({ salaries });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { calculateSalary, viewSalaries, viewAllSalaries };
