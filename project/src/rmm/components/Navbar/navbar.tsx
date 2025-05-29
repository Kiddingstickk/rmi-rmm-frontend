import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isRmm = location.pathname.startsWith('/rmm');

  const handleToggle = () => {
    navigate(isRmm ? '/' : '/rmm');
  };

  const handleLogoClick = () => {
    navigate(isRmm ? '/rmm' : '/');
  };

  const handleHomeClick = () => {
    navigate(isRmm ? '/rmm' : '/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLoginClick = () => {
    navigate('/signin');
  };

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Left side - Logo */}
      <div className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={handleLogoClick}>
        RateMy
      </div>

      {/* Right side - Buttons */}
      <div className="flex items-center gap-6 text-gray-700">
        <button
          className="hover:text-blue-600 transition-colors font-medium"
          onClick={handleHomeClick}
        >
          Home
        </button>

        {isLoggedIn && (
          <button
            className="hover:text-blue-600 transition-colors font-medium"
            onClick={handleProfileClick}
          >
            Profile
          </button>
        )}

        <button
          className="hover:text-blue-600 transition-colors font-medium"
          onClick={handleToggle}
        >
          {isRmm ? 'Rate My Interviewer' : 'Rate My Management'}
        </button>

        {isLoggedIn ? (
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md transition"
            onClick={onLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md transition"
            onClick={handleLoginClick}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
