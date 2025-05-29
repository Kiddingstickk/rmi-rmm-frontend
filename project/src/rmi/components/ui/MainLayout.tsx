import React, { ReactNode } from 'react';
import Navbar from '../../../rmm/components/Navbar/navbar'; // Adjust the path as needed

interface MainLayoutProps {
  children: ReactNode;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, isLoggedIn, onLogout }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />

      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
