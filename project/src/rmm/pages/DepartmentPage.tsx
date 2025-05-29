import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar/navbar';
import Sidebar from '../components/sidebar/Sidebar';
import ManagerCard from '../components/departments/ManagerCard';

const DepartmentPage: React.FC = () => {
  const { id } = useParams(); // department ID
  const [isLoggedIn, setIsLoggedIn] = useState(true); // or get from context/auth provider

  const handleLogout = () => {
    // Your logout logic here
    setIsLoggedIn(false);
    // maybe redirect or clear auth tokens
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <main className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Department: {id}</h1>
          {/* Replace below with dynamic data */}
          <ManagerCard name="Alice Johnson" position="Team Lead" department="Marketing" averageRating={4.3} />
          <ManagerCard name="Bob Smith" position="Senior Manager" department="Marketing" averageRating={3.9} />
        </main>
      </div>
    </div>
  );
};

export default DepartmentPage;
