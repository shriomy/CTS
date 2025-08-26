import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { markAttendance, getEmployeeAttendance, calculateSalary } from '../api/attendance';
import { getEmployees } from '../api/employees';

const Attendance = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState('');
    const [hours, setHours] = useState(8);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState([]);
    const [salary, setSalary] = useState(null);

    useEffect(() => {
        getEmployees().then(data => setEmployees(data.employees || []));
    }, []);

    const handleMark = async () => {
        if (!selectedEmp) return alert('Select employee');
        await markAttendance({ 
            employee_id: selectedEmp, 
            date: date, 
            hours_worked: Number(hours) 
        });
        fetchAttendance();
    };

    const fetchAttendance = async () => {
        if (!selectedEmp) return;
        const att = await getEmployeeAttendance(selectedEmp);
        setAttendance(att.attendance || []);
    };

    const handleCalculateSalary = async () => {
        if (!selectedEmp) return alert('Select employee first');
        
        // Calculate for the current week
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay()); // Sunday
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // Saturday
        
        const sal = await calculateSalary({
            employee_id: selectedEmp,
            week_start: weekStart.toISOString().split('T')[0],
            week_end: weekEnd.toISOString().split('T')[0]
        });
        setSalary(sal.salary);
    };

    return (
        <div style={{ maxWidth: '600px', margin: '20px auto' }}>
            <h2>Attendance</h2>
            <div>
                <select value={selectedEmp} onChange={(e) => setSelectedEmp(e.target.value)}>
                    <option value="">Select Employee</option>
                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                </select>
                <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                />
                <input 
                    type="number" 
                    value={hours} 
                    onChange={(e) => setHours(e.target.value)} 
                    placeholder="Hours worked" 
                />
                <button onClick={handleMark}>Mark Attendance</button>
                <button onClick={handleCalculateSalary}>Calculate Salary</button>
            </div>
            
            <h3>Attendance Records</h3>
            <ul>
                {attendance.map(a => (
                    <li key={a.id}>
                        {new Date(a.date).toLocaleDateString()} - {a.attendance_type} ({a.hours_worked} hrs)
                    </li>
                ))}
            </ul>
            
            {salary && (
                <div>
                    <h3>Salary Calculation</h3>
                    <p>Gross: ${salary.gross_salary}</p>
                    <p>Deductions: ${salary.deductions}</p>
                    <p>Allowances: ${salary.allowances}</p>
                    <p>Advances: ${salary.advances}</p>
                    <p>Net Salary: ${salary.net_salary}</p>
                </div>
            )}
        </div>
    );
};

export default Attendance;