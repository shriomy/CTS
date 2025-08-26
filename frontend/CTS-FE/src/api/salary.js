import API from './axios';

// Calculate salary
export const calculateSalary = async (data) => {
    const res = await API.post('/salaries/calculate', data);
    return res.data;
};

// Get salaries for employee
export const getEmployeeSalaries = async (employee_id) => {
    const res = await API.get(`/salaries/employee/${employee_id}`);
    return res.data;
};

// Get all salaries (manager only)
export const getAllSalaries = async () => {
    const res = await API.get('/salaries');
    return res.data;
};