import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaStar,
  FaCommentDots,
  FaSignOutAlt,
  FaHome,
} from 'react-icons/fa';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const ResponsiveNavbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isRmm = location.pathname.startsWith('/rmm');

  const handleToggle = () => navigate(isRmm ? '/' : '/rmm');
  const handleLogoClick = () => navigate(isRmm ? '/rmm' : '/');
  const handleProfileClick = () => navigate('/profile');
  const handleLoginClick = () => navigate('/signin');
  const handleHomeClick = () => navigate('/');

  const navItems = (
    <>
      <button onClick={handleHomeClick} className="flex items-center gap-2 hover:text-blue-600">
        <FaHome /> Home
      </button>
      {isLoggedIn && (
        <button onClick={handleProfileClick} className="flex items-center gap-2 hover:text-blue-600">
          <FaUserCircle /> Profile
        </button>
      )}
      <button onClick={handleToggle} className="hover:text-blue-600">
        {isRmm ? 'Rate My Interviewer' : 'Rate My Management'}
      </button>
      {isLoggedIn ? (
        <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md">
          Logout
        </button>
      ) : (
        <button onClick={handleLoginClick} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md">
          Login
        </button>
      )}
    </>
  );

  return (
    <>
      {/* Top Navbar */}
      <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={handleLogoClick}>
          RateMy
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          {navItems}
        </div>

        {/* Mobile hamburger - right aligned */}
        <div className="md:hidden">
          <button onClick={() => setIsSidebarOpen(true)}>
            <FaBars className="text-2xl text-gray-700" />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay with slide-in effect */}
      <div className={`fixed inset-0 z-40 transition-all duration-300 ${isSidebarOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Slide-in Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } flex flex-col gap-6 p-6`}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="text-2xl">
              <FaTimes />
            </button>
          </div>

          <div className="flex flex-col gap-4 text-base font-medium text-gray-800">
            {navItems}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResponsiveNavbar;
