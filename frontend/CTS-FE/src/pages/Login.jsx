import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(loginUser({ name, password }));
        if (loginUser.fulfilled.match(resultAction)) {
            navigate('/employees'); // redirect after login
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2>Manager Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default Login;
