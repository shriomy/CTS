import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getEmployees, updateEmployee, deleteEmployee } from '../api/employees';

// Fetch all employees
export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
    const data = await getEmployees();
    return data;
});

// Add employee
export const createEmployee = createAsyncThunk('employees/createEmployee', async (employee) => {
    const data = await addEmployee(employee);
    return data;
});

// Update employee
export const editEmployee = createAsyncThunk('employees/editEmployee', async ({ id, employee }) => {
    const data = await updateEmployee(id, employee);
    return data;
});

// Delete employee
export const removeEmployee = createAsyncThunk('employees/removeEmployee', async (id) => {
    await deleteEmployee(id);
    return id;
});

const employeeSlice = createSlice({
    name: 'employees',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    // In employeeSlice.js, update the extraReducers:
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
        .addCase(createEmployee.fulfilled, (state, action) => { 
            state.list.push(action.payload.employee); 
        })
        // Update
        .addCase(editEmployee.fulfilled, (state, action) => {
            const index = state.list.findIndex(emp => emp.id === action.payload.employee.id);
            if (index !== -1) state.list[index] = action.payload.employee;
        })
        // Delete
        .addCase(removeEmployee.fulfilled, (state, action) => {
            state.list = state.list.filter(emp => emp.id !== action.payload);
        });
},
});

export default employeeSlice.reducer;
