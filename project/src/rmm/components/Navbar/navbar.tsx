import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../../rmi/lib/useAuth';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const ResponsiveNavbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  

  const handleLoginClick = () => navigate('/signin');

  return (
    <>
      {/* Top Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center shadow-md bg-pastelBlue text-white transition-colors duration-300">
        <Link to="/" aria-label="Go to RMM Home">
          <img
            src="/rmmlogo.png"
            alt="Rate My Manager Logo"
            className="w-10 h-10 md:w-12 md:h-12 cursor-pointer"
          />
        </Link>

        <div className="hidden md:flex items-center gap-6 font-medium">
          <Link to="/search-managers" className="hover:text-blue-200 text-sm">
            Search
          </Link>
          <Link to="/rate-manager" className="hover:text-blue-200 text-sm">
            Rate
          </Link>
          <Link to="/team" className="hover:text-blue-200 text-sm">
            Team
          </Link>

          {isLoggedIn ? (
            <>
             
              <button
                onClick={onLogout}
                className="text-sm bg-pastelBlue text-white px-4 py-2 rounded-md hover:bg-blue-200 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLoginClick}
              className="text-sm bg-pastelBlue text-white px-4 py-2 rounded-md hover:bg-blue-200 transition"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <button onClick={() => setIsSidebarOpen(true)} aria-label="Open menu">
            <FaBars className="text-2xl text-gray-800" />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 transition-all duration-300 ${isSidebarOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsSidebarOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-64 bg-white text-gray-800 shadow-lg transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col gap-6 p-6`}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-blue-700">Rate My Manager</h2>
            <button onClick={() => setIsSidebarOpen(false)} aria-label="Close menu">
              <FaTimes className="text-2xl" />
            </button>
          </div>

          <div className="flex flex-col gap-4 text-base font-medium">
            <Link to="/search-managers" onClick={() => setIsSidebarOpen(false)}>Search</Link>
            <Link to="/rate-manager" onClick={() => setIsSidebarOpen(false)}>Rate</Link>
            <Link to="/team" onClick={() => setIsSidebarOpen(false)}>Team</Link>

            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  setIsSidebarOpen(false);
                }}
                className="bg-white border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition"
              >
                Logout
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  handleLoginClick();
                  setIsSidebarOpen(false);
                }}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
              >
                Login
              </button>
            )}
                      </div>
        </div>
      </div>
    </>
  );
};

export default ResponsiveNavbar;