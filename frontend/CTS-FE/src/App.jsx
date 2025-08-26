import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Employees from './pages/Employees'; // we will create this next
import { useSelector } from 'react-redux';

function App() {
    const { token } = useSelector((state) => state.auth);


    return (
        <Routes>
            <Route path="/" element={token ? <Navigate to="/employees" /> : <Login />} />
            <Route
                path="/employees"
                element={token ? <Employees /> : <Navigate to="/" />}
            />
        </Routes>
    );
}

export default App;
