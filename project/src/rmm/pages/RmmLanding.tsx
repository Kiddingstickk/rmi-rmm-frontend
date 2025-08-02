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
      "url": "https://ratemymanagement.com/",
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
          An Anonymous Way to Rate Your Manager in the Baltimore Restaurant Scene
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <a href="/search-managers" className="bg-pastelBlue hover:bg-blue-600 text-white px-6 py-3 rounded-md font-semibold">
              Search Managers
            </a>
            <a href="/rate-manager" className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-md font-semibold">
              Rate Now
            </a>
          </div>
        </div>
      </section>

      {/* ✅ How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-800">How it Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white shadow-sm p-6 rounded-lg flex flex-col justify-center items-center">
              <img src="/webpic.png" alt="Search feature" className="w-14 h-14 mb-4" />
              <p className="text-gray-700 font-medium text-sm sm:text-base">Search by Interviewer Name or Company</p>
            </div>
            <div className="bg-white shadow-sm p-6 rounded-lg flex flex-col justify-center items-center">
              <img src="/pencil.png" alt="Position entry" className="w-14 h-14 mb-4" />
              <p className="text-gray-700 font-medium text-sm sm:text-base">Add the position you interviewed for</p>
            </div>
            <div className="bg-white shadow-sm p-6 rounded-lg flex flex-col justify-center items-center">
              <img src="/likedislike.png" alt="Review rating" className="w-14 h-14 mb-4" />
              <p className="text-gray-700 font-medium text-sm sm:text-base">Add your review</p>
            </div>
            <div className="bg-white shadow-sm p-6 rounded-lg flex flex-col justify-center items-center">
              <img src="/detective.png" alt="Anonymous share" className="w-14 h-14 mb-4" />
              <p className="text-gray-700 font-medium text-sm sm:text-base">Share to the world anonymously</p>
            </div>
          </div>
        </div>
      </section>
     {/*why rate your manager */}
      <section className="py-16 px-6 max-w-3xl mx-auto text-gray-800">
        <h2 className="text-3xl font-bold mb-10 text-center">Why Rate Your Manager?</h2>
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Empower Others</h3>
            <p className="text-sm text-gray-600">
            Your experience can be a guiding light for someone else. By sharing your story, you help others avoid toxic environments, recognize great leadership, and make smarter career choices. Every review contributes to a more informed and supportive professional community.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Promote Transparency</h3>
            <p className="text-sm text-gray-600">
            Honest feedback is the foundation of accountability. When managers know their actions are visible, they’re more likely to lead with integrity. Your review helps build a culture where transparency isn’t just encouraged — it’s expected.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Safe & Anonymous</h3>
            <p className="text-sm text-gray-600">
            We understand the risks of speaking up. That’s why Rate My Manager is designed to protect your identity while amplifying your voice. You can share openly without fear of retaliation, knowing your privacy is our top priority.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Built for All Industries</h3>
            <p className="text-sm text-gray-600">
            Whether you're in tech, hospitality, healthcare, education, or retail — leadership matters. Our platform is built to support feedback across all sectors, helping professionals everywhere hold their managers to a higher standard.
            </p>
          </div>
        </div>
        <div className="text-center mt-10">
          <a href="/rate-manager" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-semibold">
            Rate a Manager
          </a>
        </div>
      </section>

      {/* ✅ Our Mission */}
      <section className="py-16 px-6 bg-gray-100 text-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-base leading-relaxed mb-4">
            At Rate My Manager, we believe that transparency leads to better workplaces. Our mission is to empower employees to share
            their experiences with leadership in a safe, anonymous, and constructive way. We aim to foster a culture where feedback
            is valued, and leadership is held to a higher standard.
          </p>
          <p className="text-base leading-relaxed mb-4">
            We are not just a review platform — we are a movement toward fairness, accountability, and growth. By giving professionals
            a voice, we help companies identify strengths and areas for improvement in their management practices.
          </p>
          <p className="text-base leading-relaxed">
            Want to learn more about the people behind this mission?
            <a href="/team" className="text-blue-600 hover:underline ml-1">Meet our team</a>.
          </p>
        </div>
      </section>



      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

    {/* About Section */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Rate My Manager</h3>
      <p className="text-sm leading-relaxed">
        Empowering professionals to share honest feedback about workplace leadership. 
        Transparency starts with your voice.
      </p>
    </div>

    {/* Navigation Links */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Explore</h3>
      <ul className="space-y-2 text-sm">
        <li><a href="/search-managers" className="hover:underline">Search Managers</a></li>
        <li><a href="/rate-manager" className="hover:underline">Rate a Manager</a></li>
        <li><a href="/contact" className="hover:underline">Contact Us</a></li>
        <li><a href="/team" className="hover:underline">Our Team</a></li>
        <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
        <li><a href="/terms" className="hover:underline">Terms of Service</a></li>
        <li><a href="/faq" className="hover:underline">FAQ</a></li>
      </ul>
    </div>

    {/* Contact Info */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Get in Touch</h3>
      <p className="text-sm">Email: support@ratemymanager.com</p>
      <p className="text-sm mt-2">© {new Date().getFullYear()} Rate My Manager</p>
    </div>

  </div>
</footer>

      {/* ✅ Final CTA 
      <section className="py-20 px-6 text-center bg-indigo-700 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to make your voice heard?</h2>
        <p className="mb-6">Join the community of professionals sharing real experiences.</p>
      </section>*/}
    </div>
  );
};

export default RmmLanding;