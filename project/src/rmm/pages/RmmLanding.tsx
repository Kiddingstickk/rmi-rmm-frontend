import React, { useEffect } from 'react';
import Navbar from '../components/Navbar/navbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../rmi/lib/useAuth';

const RmmLanding = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  // 🧠 Inject structured data without Helmet
  useEffect(() => {
    const jsonLd = document.createElement('script');
    jsonLd.setAttribute('type', 'application/ld+json');
    jsonLd.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Rate My Manager",
      "description": "Explore and share anonymous interview reviews for hiring managers. Built for transparency, powered by real candidate insights.",
      "url": "https://rmi-rmm.netlify.app/rmm",
      "author": {
        "@type": "Organization",
        "name": "Rate My Interviewer"
      }
    });
    document.head.appendChild(jsonLd);
    return () => {
      document.head.removeChild(jsonLd);
    };
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} onLogout={logout} />

      {/* ✅ Hero Section */}
      <section
        className="relative bg-cover bg-center text-white mt-[64px] pt-16 pb-32 px-6"
        style={{ backgroundImage: "url('/rmmbg.avif')" }}
      >
        <div className="absolute inset-0 bg-black/10 z-0" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-6">RATE MY MANAGER</h1>
          <p className="text-lg max-w-3xl mx-auto text-gray-100 mb-10">
            Discover feedback from real candidates. Search, share, and support transparency in tech hiring.
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <a href="/rmm/search-managers" className="bg-pastelBlue hover:bg-blue-600 text-white px-6 py-3 rounded-md font-semibold">
              Search Managers
            </a>
            <a href="/rmm/rate-manager" className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-md font-semibold">
              Rate Now
            </a>
          </div>
        </div>
      </section>

      {/* ✅ How It Works */}
      <section className="py-20 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">How it Works</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-left">
          <div className="bg-white shadow-sm p-6 rounded-lg">
            <img src="/webpic.png" alt="Magnifying glass for search feature" className="w-14 h-14 mb-4" />
            <p className="text-gray-700 font-medium">Search by Interviewer Name or Company</p>
          </div>
          <div className="bg-white shadow-sm p-6 rounded-lg">
            <img src="/pencil.png" alt="Pencil icon for position entry" className="w-14 h-14 mb-4" />
            <p className="text-gray-700 font-medium">Add the position you interviewed for</p>
          </div>
          <div className="bg-white shadow-sm p-6 rounded-lg">
            <img src="/likedislike.png" alt="Thumbs icon for review rating" className="w-14 h-14 mb-4" />
            <p className="text-gray-700 font-medium">Add your review</p>
          </div>
          <div className="bg-white shadow-sm p-6 rounded-lg">
            <img src="/detective.png" alt="Anonymous share icon" className="w-14 h-14 mb-4" />
            <p className="text-gray-700 font-medium">Share to the world anonymously</p>
          </div>
        </div>
      </section>

      {/* ✅ Final CTA */}
      <section className="py-20 px-6 text-center bg-indigo-700 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to make your voice heard?</h2>
        <p className="mb-6">Join the community of professionals sharing real experiences.</p>
      </section>
    </div>
  );
};

export default RmmLanding;