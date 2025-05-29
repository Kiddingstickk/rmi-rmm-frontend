// src/rmm/pages/RmmLanding.tsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar/navbar';
import { useNavigate } from 'react-router-dom';
import  {useAuth}  from '../../rmi/lib/useAuth'; // Adjust if your auth hook is elsewhere

const RmmLanding = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth(); // Replace with your actual hook/context
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/rmm/searchresults?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} onLogout={logout} />

      {/* Hero Section */}
      <section className="text-center py-24 px-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Let your voice be heard
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Share your experience with managers and help others make informed decisions.
        </p>
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search a manager..."
            className="w-full px-4 py-3 rounded-l-md text-black focus:outline-none"
          />
          <button
            type="submit"
            className="bg-white text-indigo-700 font-semibold px-4 py-3 rounded-r-md hover:bg-gray-200"
          >
            Search
          </button>
        </form>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div>
            <h3 className="text-xl font-semibold mb-2">1. Find a Manager</h3>
            <p className="text-gray-600">Browse or search for managers in various departments.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">2. Share a Review</h3>
            <p className="text-gray-600">Leave a constructive review anonymously.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">3. Empower Others</h3>
            <p className="text-gray-600">Help others with your honest feedback.</p>
          </div>
        </div>
      </section>

      {/* Trending Managers */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">Trending Managers</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Replace with dynamic data if needed */}
          <div className="bg-white shadow p-4 rounded-md">
            <h4 className="font-semibold">Jane Doe</h4>
            <p className="text-gray-500">Engineering - 4.8⭐</p>
          </div>
          <div className="bg-white shadow p-4 rounded-md">
            <h4 className="font-semibold">Mark Lee</h4>
            <p className="text-gray-500">Marketing - 4.5⭐</p>
          </div>
          <div className="bg-white shadow p-4 rounded-md">
            <h4 className="font-semibold">Sophia Wu</h4>
            <p className="text-gray-500">Product - 4.6⭐</p>
          </div>
        </div>
      </section>

      {/* Popular Companies */}
      <section className="py-16 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">Popular Companies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="text-gray-600">Google</div>
          <div className="text-gray-600">Amazon</div>
          <div className="text-gray-600">Meta</div>
          <div className="text-gray-600">Netflix</div>
        </div>
      </section>

      {/* Final CTA */}
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
