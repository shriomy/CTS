import React from 'react';
import Button from '../ui/Button';

const Header = ({ title, onNavigate, currentPage }) => {
  const navigation = [
    { key: 'employees', label: 'Employees' },
    { key: 'attendance', label: 'Attendance' }
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          
          <nav className="flex space-x-2">
            {navigation.map((item) => (
              <Button
                key={item.key}
                variant={currentPage === item.key ? 'primary' : 'secondary'}
                size="small"
                onClick={() => onNavigate(item.key)}
              >
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;