import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Header from './components/layout/Header';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? children : <Navigate to="/" />;
};

// Layout Component for protected routes
const Layout = ({ children, currentPage, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Employee ERP System" currentPage={currentPage} onNavigate={onNavigate} />
      <main>{children}</main>
    </div>
  );
};

function App() {
  const { token } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = React.useState('employees');

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      <Routes>
        {/* Public Route - Login */}
        <Route 
          path="/" 
          element={token ? <Navigate to="/employees" /> : <Login />} 
        />
        
        {/* Protected Routes */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <Layout currentPage="employees" onNavigate={handleNavigation}>
                <Employees />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Layout currentPage="attendance" onNavigate={handleNavigation}>
                <Attendance />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch all route - redirect to employees */}
        <Route path="*" element={<Navigate to={token ? "/employees" : "/"} />} />
      </Routes>
    </div>
  );
}

export default App;