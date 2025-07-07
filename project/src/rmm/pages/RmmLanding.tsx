import React, { useState } from 'react';
import Navbar from '../components/Navbar/navbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../rmi/lib/useAuth';

const RmmLanding = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-white min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} onLogout={logout} />

      {/* 🟦 Hero Section */}
      <section
        className="relative bg-cover bg-center text-white mt-[64px] pt-16 pb-32 px-6"
        style={{ backgroundImage: "url('/rmmbg.png')" }}
      >
        <div className="absolute inset-0 bg-black/10 z-0" />
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-10">RATE MY MANAGER</h1>

          {/* 🔍 Search Input */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search managers by name or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate(`/rmm/search-managers?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              className="w-full px-5 py-3 rounded-md text-black placeholder-gray-600 shadow-md focus:outline-none"
            />
          </div>

          <div className="flex justify-center gap-6 flex-wrap">
            <button
              onClick={() => navigate('/rmm/search-managers')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-semibold"
            >
              Search Managers
            </button>
            <button
              onClick={() => navigate('/rmm/rate-manager')}
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-md font-semibold"
            >
              Rate Now
            </button>
          </div>
        </div>
      </section>

      {/* 🔧 How It Works */}
      <section className="py-20 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">How it Works</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-left">
          {/* Step 1 */}
          <div className="bg-white shadow-sm p-6 rounded-lg">
            <img src="/rmm-icons/search.png" alt="Search Icon" className="w-14 h-14 mb-4" />
            <p className="text-gray-700 font-medium">Search by Interviewer Name or Company</p>
          </div>

          {/* Step 2 */}
          <div className="bg-white shadow-sm p-6 rounded-lg">
            <img src="/rmm-icons/position.png" alt="Position Icon" className="w-14 h-14 mb-4" />
            <p className="text-gray-700 font-medium">Add the position you interviewed for</p>
          </div>

          {/* Step 3 */}
          <div className="bg-white shadow-sm p-6 rounded-lg">
            <img src="/rmm-icons/review.png" alt="Review Icon" className="w-14 h-14 mb-4" />
            <p className="text-gray-700 font-medium">Add your review</p>
          </div>

          {/* Step 4 */}
          <div className="bg-white shadow-sm p-6 rounded-lg">
            <img src="/rmm-icons/share.png" alt="Share Icon" className="w-14 h-14 mb-4" />
            <p className="text-gray-700 font-medium">Share to the world anonymously</p>
          </div>
        </div>
      </section>

      {/* 📣 Final CTA */}
      <section className="py-20 px-6 text-center bg-indigo-700 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to make your voice heard?</h2>
        <p className="mb-6">Join the community of professionals sharing real experiences.</p>
        <button
          onClick={() => navigate('/rmm/Home')}
          className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-md hover:bg-gray-200"
        >
          Explore Managers
        </button>
      </section>
    </div>
  );
};

export default RmmLanding;