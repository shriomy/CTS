import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as employeeAPI from '../api/employees'; // Import all API functions

// Fetch all employees
export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
    const data = await employeeAPI.getEmployees();
    return data;
});

// Add employee
export const createEmployee = createAsyncThunk('employees/createEmployee', async (employee) => {
    const data = await employeeAPI.createEmployee(employee);
    return data;
});

// Update employee
export const editEmployee = createAsyncThunk('employees/editEmployee', async ({ id, employee }) => {
    const data = await employeeAPI.updateEmployee(id, employee);
    return data;
});

// Delete employee
export const removeEmployee = createAsyncThunk('employees/removeEmployee', async (id) => {
    await employeeAPI.deleteEmployee(id);
    return id;
});

const employeeSlice = createSlice({
    name: 'employees',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchEmployees.pending, (state) => { 
                state.loading = true; 
                state.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => { 
                state.loading = false; 
                state.list = action.payload.employees || []; 
            })
            .addCase(fetchEmployees.rejected, (state, action) => { 
                state.loading = false; 
                state.error = action.error.message; 
            })
            // Add
            .addCase(createEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEmployee.fulfilled, (state, action) => { 
                state.loading = false;
                state.list.push(action.payload.employee); 
            })
            .addCase(createEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update
            .addCase(editEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editEmployee.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.list.findIndex(emp => emp.id === action.payload.employee.id);
                if (index !== -1) state.list[index] = action.payload.employee;
            })
            .addCase(editEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Delete
            .addCase(removeEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter(emp => emp.id !== action.payload);
            })
            .addCase(removeEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default employeeSlice.reducer;