import API from './axios';

// Fetch all employees
export const getEmployees = async () => {
    const response = await API.get('/employees');
    return response.data;
};

// Get employee by ID
export const getEmployee = async (id) => {
    const response = await API.get(`/employees/${id}`);
    return response.data;
};

export const createEmployee = async (employee) => {
    const response = await API.post('/employees', employee);
    return response.data;
};

// Update an employee
export const updateEmployee = async (id, employee) => {
    const response = await API.put(`/employees/${id}`, employee);
    return response.data;
};

// Delete an employee
export const deleteEmployee = async (id) => {
    const response = await API.delete(`/employees/${id}`);
    return response.data;
};