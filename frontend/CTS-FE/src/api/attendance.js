import API from './axios';

// Mark attendance
export const markAttendance = async (data) => {
    const res = await API.post('/attendance/mark', data);
    return res.data;
};

// Get employee attendance
export const getEmployeeAttendance = async (employee_id) => {
    const res = await API.get(`/attendance/employee/${employee_id}`);
    return res.data;
};

// Get all attendance (manager only)
export const getAllAttendance = async () => {
    const res = await API.get('/attendance');
    return res.data;
};

// Calculate salary (POST request with data)
export const calculateSalary = async (data) => {
    const res = await API.post('/salaries/calculate', data);
    return res.data;
};