import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, createEmployee, editEmployee, removeEmployee } from '../redux/employeeSlice';

const Employees = () => {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((state) => state.employees);

    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    const handleAddOrEdit = () => {
        if (editingId) {
            dispatch(editEmployee({ id: editingId, employee: { name, role } }));
            setEditingId(null);
        } else {
            dispatch(createEmployee({ name, role }));
        }
        setName('');
        setRole('');
    };

    const handleEdit = (emp) => {
        setEditingId(emp.id);
        setName(emp.name);
        setRole(emp.role);
    };

    const handleDelete = (id) => {
        dispatch(removeEmployee(id));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div style={{ maxWidth: '600px', margin: '20px auto' }}>
            <h2>Employees</h2>
            <div>
                <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
                <button onClick={handleAddOrEdit}>{editingId ? 'Update' : 'Add'}</button>
            </div>
            <ul>
                {list.map(emp => (
                    <li key={emp.id}>
                        {emp.name} - {emp.role}
                        <button onClick={() => handleEdit(emp)}>Edit</button>
                        <button onClick={() => handleDelete(emp.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Employees;
