const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const salaryRoutes = require('./routes/salaryRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes); // all auth routes start with /auth
app.use('/employees', employeeRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/salaries', salaryRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Employee ERP backend is running!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
