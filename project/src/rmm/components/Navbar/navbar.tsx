
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import {
  UserRound,
  MessageSquare,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const NAVY = '#213A6B';

const ResponsiveNavbar: React.FC<NavbarProps> = ({
  isLoggedIn,
  onLogout,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAccountPinned, setIsAccountPinned] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useNavigate();
  const accountRef = useRef<HTMLDivElement>(null);

  const handleLoginClick = () => navigate('/signin');

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setIsAccountOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAccountOpen(false);
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  //const closeAccountMenu = () => setIsAccountOpen(false);

  const handleLogout = () => {
    setIsAccountOpen(false);
    setIsSidebarOpen(false);
    onLogout();
  };


  const cancelCloseTimer = () => {
  if (closeTimer.current) {
    clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }
};

const scheduleAccountClose = () => {
  cancelCloseTimer();

  closeTimer.current = setTimeout(() => {
    if (!isAccountPinned) {
      setIsAccountOpen(false);
    }
  }, 350);
};

const toggleAccountMenu = () => {
  cancelCloseTimer();

  if (isAccountPinned) {
    setIsAccountPinned(false);
    setIsAccountOpen(false);
  } else {
    // First click pins the menu, even if hover already opened it.
    setIsAccountPinned(true);
    setIsAccountOpen(true);
  }
};

const closeAccountMenu = () => {
  cancelCloseTimer();
  setIsAccountPinned(false);
  setIsAccountOpen(false);
};

  return (
    <>
      {/* Top Navbar */}
      <nav
        className="w-full px-6 py-4 flex justify-between items-center shadow-md text-white transition-colors duration-300 relative z-30"
        style={{ backgroundColor: NAVY }}
      >
        <Link to="/" aria-label="Go to RMM Home">
          <img
            src="/rmmlogo.png"
            alt="Rate My Manager Logo"
            className="w-10 h-10 md:w-12 md:h-12 cursor-pointer"
          />
        </Link>

        <div className="hidden md:flex items-center gap-12 font-medium">

          {/* Search */}
          <div className="relative group">
            <Link
              to="/search-managers"
              className="text-sm text-white/90 hover:text-white transition-colors duration-200"
            >
              Search
            </Link>

            <div className="absolute top-full right-0 pt-4 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
              <div className="w-[440px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex">
                <div className="w-[38%] h-36 flex items-center pt-8">
                  <img
                    src="/rmm_pic.png"
                    alt="Search managers"
                    className="w-full h-auto object-contain"
                  />
                </div>

                <div className="flex-1 p-5 text-gray-800">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: NAVY }}>
                    Search
                  </p>

                  <h3 className="text-lg font-bold mb-2">
                    Find your manager
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    Search managers and discover what employees think
                    about their leadership and workplace.
                  </p>

                  <Link
                    to="/search-managers"
                    className="mt-3 inline-block text-xs font-semibold hover:underline transition-colors"
                    style={{ color: NAVY }}
                  >
                    Explore managers →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Rate */}
          <div className="relative group">
            <Link
              to="/rate-manager"
              className="text-sm text-white/90 hover:text-white transition-colors duration-200"
            >
              Rate
            </Link>

            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
              <div className="w-[440px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex">
                <div className="w-[38%] h-36 flex items-center pt-8">
                  <img
                    src="/rate_pic.png"
                    alt="Rate a manager"
                    className="w-full h-auto object-contain"
                  />
                </div>

                <div className="flex-1 p-5 text-gray-800">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: NAVY }}>
                    Rate
                  </p>

                  <h3 className="text-lg font-bold mb-2">
                    Share your experience
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    Give an honest review of your manager and help other
                    employees make better workplace decisions.
                  </p>

                  <Link
                    to="/rate-manager"
                    className="mt-3 inline-block text-xs font-semibold hover:underline transition-colors"
                    style={{ color: NAVY }}
                  >
                    Rate a manager →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="relative group">
            <Link
              to="/team"
              className="text-sm text-white/90 hover:text-white transition-colors duration-200"
            >
              Team
            </Link>

            <div className="absolute top-full right-0 pt-4 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
              <div className="w-[440px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex">
                <div className="w-[38%] h-36 flex items-center pt-10">
                  <img
                    src="/team_pic.png"
                    alt="Rate My Manager team"
                    className="w-full h-auto object-contain"
                  />
                </div>

                <div className="flex-1 p-5 text-gray-800">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: NAVY }}>
                    Team
                  </p>

                  <h3 className="text-lg font-bold mb-2">
                    Meet the team
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    Learn about the people behind Rate My Manager and our mission
                    to make workplaces more transparent.
                  </p>

                  <Link
                    to="/team"
                    className="mt-3 inline-block text-xs font-semibold hover:underline transition-colors"
                    style={{ color: NAVY }}
                  >
                    Meet the team →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Account Menu / Login */}
          
          {isLoggedIn ? (
            <div
              className="relative"
              ref={accountRef}
              onMouseEnter={() => {
                cancelCloseTimer();
                setIsAccountOpen(true);
              }}
              onMouseLeave={scheduleAccountClose}
            >
              <button
                type="button"
                onClick={toggleAccountMenu}
                aria-label="Open account menu"
                aria-expanded={isAccountOpen}
                className="w-11 h-11 rounded-full bg-white text-[#213A6B] flex items-center justify-center hover:bg-gray-100 transition shadow-sm"
              >
                <UserRound size={21} strokeWidth={2} />
              </button>

              {isAccountOpen && (
                <div className="absolute right-0 top-full pt-3 w-52 z-50">
                  <div className="bg-white text-gray-800 rounded-xl shadow-xl border border-gray-100 py-2">

                    <Link
                      to="/profile"
                      onClick={closeAccountMenu}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition"
                    >
                      <UserRound size={17} className="text-[#213A6B]" />
                      Profile
                    </Link>

                    <Link
                      to="/my-reviews"
                      onClick={closeAccountMenu}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition"
                    >
                      <MessageSquare size={17} className="text-[#213A6B]" />
                      Reviews
                    </Link>

                    <Link
                      to="/account-settings"
                      onClick={closeAccountMenu}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition"
                    >
                      <Settings size={17} className="text-[#213A6B]" />
                      Settings
                    </Link>

                    <div className="border-t border-gray-100 my-1" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLoginClick}
              className="text-sm bg-white text-[#213A6B] font-semibold px-5 py-2 rounded-md hover:bg-[#eaf0f8] transition"
            >
              Login
            </button>
          )}

        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
            className="text-white"
          >
            <FaBars className="text-2xl" />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsSidebarOpen(false)}
        />

        <div
          className={`absolute right-0 top-0 h-full w-64 max-w-full bg-white text-[#213A6B] shadow-lg transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col gap-6 p-6`}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold" style={{ color: NAVY }}>
              Rate My Manager
            </h2>

            <button
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close menu"
            >
              <FaTimes className="text-2xl" />
            </button>
          </div>

          <div className="flex flex-col gap-4 text-base font-medium">
            <Link to="/search-managers" onClick={() => setIsSidebarOpen(false)}>
              Search
            </Link>

            <Link to="/rate-manager" onClick={() => setIsSidebarOpen(false)}>
              Rate
            </Link>

            <Link to="/team" onClick={() => setIsSidebarOpen(false)}>
              Team
            </Link>

            {isLoggedIn ? (
              <>
                <div className="border-t border-gray-200 pt-4" />

                <Link
                  to="/profile"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Profile
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-left bg-[#213A6B] text-white px-4 py-2 rounded-md hover:bg-[#1b3b70] transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  handleLoginClick();
                  setIsSidebarOpen(false);
                }}
                className="bg-[#213A6B] text-white px-4 py-2 rounded-md hover:bg-[#1b3b70] transition"
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
