import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, createEmployee, editEmployee, removeEmployee } from '../redux/employeeSlice';
import { getEmployees, createEmployee as createEmployeeAPI, updateEmployee, deleteEmployee } from '../api/employees';
import Button from '../components/ui/Button';
import Card from '../components/layout/Card';
import Modal from '../components/ui/Modal';
import EmployeeForm from '../components/EmployeeForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchEmployeesList();
  }, []);

  const fetchEmployeesList = async () => {
    setLoading(true);
    try {
      const data = await getEmployees();
      setEmployees(data.employees || []);
    } catch (err) {
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, formData);
        setEditingEmployee(null);
      } else {
        await createEmployeeAPI(formData);
      }
      setIsModalOpen(false);
      fetchEmployeesList();
    } catch (err) {
      setError('Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    
    setLoading(true);
    try {
      await deleteEmployee(id);
      fetchEmployeesList();
    } catch (err) {
      setError('Failed to delete employee');
      setLoading(false);
    }
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  if (loading && employees.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
        <Button onClick={handleAdd}>Add Employee</Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weekly Wage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${emp.weekly_wage}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button size="small" onClick={() => handleEdit(emp)}>Edit</Button>
                    <Button variant="danger" size="small" onClick={() => handleDelete(emp.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEmployee ? 'Edit Employee' : 'Add Employee'}
      >
        <EmployeeForm
          onSubmit={handleSubmit}
          initialData={editingEmployee || { name: '', role: '', weekly_wage: '' }}
          loading={loading}
          submitText={editingEmployee ? 'Update Employee' : 'Add Employee'}
        />
      </Modal>
    </div>
  );
};

export default Employees;