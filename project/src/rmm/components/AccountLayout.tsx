
import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  UserRound,
  MessageSquare,
  Bookmark,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

import ResponsiveNavbar from './Navbar/navbar';
import { useAuth } from '../../rmi/lib/useAuth';

const AccountLayout: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = [
    { label: 'My Profile', path: '/profile', icon: UserRound },
    { label: 'My Reviews', path: '/my-reviews', icon: MessageSquare },
    { label: 'Saved Managers', path: '/saved', icon: Bookmark },
    { label: 'Account Settings', path: '/account-settings', icon: Settings },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
      isActive
        ? 'bg-[#213A6B] text-white'
        : 'text-gray-600 hover:bg-[#F4F6FA] hover:text-[#213A6B]'
    }`;

  return (
    <div className="min-h-screen bg-[#F4F6FA]">

      {/* Desktop: Keep the original normal navbar */}
      <div className="hidden lg:block">
        <ResponsiveNavbar
          isLoggedIn={isLoggedIn}
          onLogout={logout}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">

        {/* Mobile: Single account navbar with RMM logo */}
        <div className="lg:hidden mb-5">
          <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">

            <div className="flex items-center justify-between px-4 py-3">
              <Link to="/" onClick={() => setMobileNavOpen(false)}>
                <img
                  src="/rmmlogo.png"
                  alt="Rate My Management"
                  className="h-10 w-auto object-contain"
                />
              </Link>

              <button
                type="button"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="flex items-center justify-center p-2 text-[#213A6B]"
                aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}
              >
                {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

            {mobileNavOpen && (
              <div className="border-t border-[#E2E8F0] p-3">
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileNavOpen(false)}
                        className={linkClass}
                      >
                        <Icon size={18} />
                        {item.label}
                      </NavLink>
                    );
                  })}

                  <button
                    type="button"
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Main account layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          <main className="flex-1 min-w-0 w-full order-2 lg:order-1">
            <Outlet />
          </main>

          {/* Desktop: Original account sidebar */}
          <aside className="hidden lg:block w-[270px] shrink-0 order-2">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sticky top-8">
              <h2 className="text-lg font-bold text-[#213A6B] mb-5">
                Your Account
              </h2>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={linkClass}
                    >
                      <Icon size={18} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="border-t border-[#E2E8F0] mt-5 pt-4">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
