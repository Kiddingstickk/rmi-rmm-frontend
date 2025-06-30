import React, { useState } from 'react';
import Navbar from '../components/Navbar/navbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../rmi/lib/useAuth';

const RmmLanding = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  return (
    <div className="bg-white min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} onLogout={logout} />

      {/* Hero with Background Image */}
      <section
        className="relative bg-cover bg-center text-white mt-[64px] pt-16 pb-32 px-6"
        style={{ backgroundImage: "url('/rmmbg.png')" }}
      >


        <div className="absolute inset-0 bg-black/10 z-0" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-10">
            RATE MY MANAGER
          </h1>
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


      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">How it Works</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-left">
          {[
            'Search by Interviewer Name or Company',
            'Add the position you interviewed for',
            'Add your review',
            'Share to the world anonymously',
          ].map((step, idx) => (
            <div key={idx} className="bg-white shadow-sm p-6 rounded-lg">
              <div className="w-14 h-14 mb-4 bg-gray-300 rounded-full" />
              <p className="text-gray-700 font-medium">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Managers */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">Trending Managers</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { name: 'Jane Doe', dept: 'Engineering - 4.8⭐' },
            { name: 'Mark Lee', dept: 'Marketing - 4.5⭐' },
            { name: 'Sophia Wu', dept: 'Product - 4.6⭐' },
          ].map((mgr, i) => (
            <div key={i} className="bg-white shadow p-4 rounded-md">
              <h4 className="font-semibold">{mgr.name}</h4>
              <p className="text-gray-500">{mgr.dept}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Companies */}
      <section className="py-20 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">Popular Companies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-gray-600">
          {['Google', 'Amazon', 'Meta', 'Netflix'].map((company, i) => (
            <div key={i}>{company}</div>
          ))}
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
