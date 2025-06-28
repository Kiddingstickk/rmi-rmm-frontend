// /screens/ContactPage.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [particles, setParticles] = useState<{ left: string; top: string }[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, formData);
      setSuccessMessage('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    const p = Array.from({ length: 30 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`
    }));
    setParticles(p);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-100 via-purple-50 to-gray-200 px-4">
      {particles.map((pos, index) => (
        <div
          key={index}
          className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-ping"
          style={{ left: pos.left, top: pos.top, animationDuration: `${2 + Math.random() * 3}s` }}
        />
      ))}

      <div className="absolute w-96 h-96 bg-indigo-200 opacity-20 rounded-full blur-3xl animate-blob move-slow-1"></div>
      <div className="absolute w-80 h-80 bg-purple-200 opacity-20 rounded-full blur-2xl animate-blob move-slow-2"></div>

      <div className="relative z-10 bg-white/60 backdrop-blur-lg shadow-xl rounded-3xl p-10 w-full max-w-3xl">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Get in Touch</h1>
        {successMessage && (
          <div className="mb-6 text-green-600 text-center font-semibold">{successMessage}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-gray-800 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-800 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-800 font-semibold">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-800 font-semibold">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl h-40 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-md hover:bg-indigo-600 transition-all duration-300 hover:scale-[1.02]"
          >
            Send Message
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Prefer to email?{' '}
          <a href="mailto:team@ratemyinterviewer.com" className="text-indigo-500 hover:underline">
            team@ratemyinterviewer.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
