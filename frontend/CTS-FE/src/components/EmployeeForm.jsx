import React from 'react';
import Input from '../components/ui/Input'
import Button from '../components/ui/Button';

const EmployeeForm = ({
  onSubmit,
  initialData = { name: '', role: '', weekly_wage: '' },
  loading = false,
  submitText = 'Add Employee'
}) => {
  const [formData, setFormData] = React.useState(initialData);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.weekly_wage || formData.weekly_wage <= 0) {
      newErrors.weekly_wage = 'Valid weekly wage is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
        disabled={loading}
      />
      
      <Input
        label="Role"
        name="role"
        value={formData.role}
        onChange={handleChange}
        error={errors.role}
        required
        disabled={loading}
      />
      
      <Input
        label="Weekly Wage"
        name="weekly_wage"
        type="number"
        value={formData.weekly_wage}
        onChange={handleChange}
        error={errors.weekly_wage}
        required
        disabled={loading}
        min="0"
        step="0.01"
      />
      
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Processing...' : submitText}
      </Button>
    </form>
  );
};

export default EmployeeForm;