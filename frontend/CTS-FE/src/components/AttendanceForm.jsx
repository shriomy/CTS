import React from 'react';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';

const AttendanceForm = ({
  onSubmit,
  employees = [],
  loading = false
}) => {
  const [formData, setFormData] = React.useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    hours_worked: 8
  });
  const [errors, setErrors] = React.useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.employee_id) newErrors.employee_id = 'Employee is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.hours_worked || formData.hours_worked <= 0) {
      newErrors.hours_worked = 'Valid hours worked is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit({
      ...formData,
      hours_worked: Number(formData.hours_worked)
    });
  };

  const employeeOptions = employees.map(emp => ({
    value: emp.id,
    label: emp.name
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Employee"
        name="employee_id"
        value={formData.employee_id}
        onChange={handleChange}
        options={employeeOptions}
        error={errors.employee_id}
        required
        disabled={loading}
      />
      
      <Input
        label="Date"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        error={errors.date}
        required
        disabled={loading}
      />
      
      <Input
        label="Hours Worked"
        name="hours_worked"
        type="number"
        value={formData.hours_worked}
        onChange={handleChange}
        error={errors.hours_worked}
        required
        disabled={loading}
        min="0"
        max="24"
        step="0.5"
      />
      
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Recording...' : 'Record Attendance'}
      </Button>
    </form>
  );
};

export default AttendanceForm;