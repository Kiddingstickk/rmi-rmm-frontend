import React, { useState } from 'react';
import Navbar from '../components/Navbar/navbar';
import DepartmentCard from '../components/departments/DepartmentCard';

const departments = [
  { name: 'Engineering', averageRating: 4.2 },
  { name: 'Marketing', averageRating: 3.8 },
  { name: 'Human Resources', averageRating: 4.5 },
  { name: 'Product', averageRating: 4.0 },
];

const ManagementHome: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // or use your auth context

  const handleLogout = () => {
    setIsLoggedIn(false);
    // add more logout logic here, e.g. redirect, clear tokens
  };

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Departments</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <DepartmentCard
              managerCount={dept.name}
              name={dept.name}
              averageRating={dept.averageRating}
             
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ManagementHome;
