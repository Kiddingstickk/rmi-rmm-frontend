import { useState, useEffect } from 'react';
import axios from 'axios';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [particles, setParticles] = useState<{ left: string, top: string }[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      setSuccessMessage('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // generate soft floating particles
  useEffect(() => {
    const p = Array.from({ length: 30 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`
    }));
    setParticles(p);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-100 via-white to-purple-200">
      {/* Floating Particles */}
      {particles.map((pos, index) => (
        <div
          key={index}
          className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-ping"
          style={{ left: pos.left, top: pos.top, animationDuration: `${2 + Math.random() * 3}s` }}
        />
      ))}

      {/* Moving Blobs */}
      <div className="absolute w-96 h-96 bg-purple-300 opacity-30 rounded-full blur-3xl animate-blob move-slow-1"></div>
      <div className="absolute w-80 h-80 bg-pink-300 opacity-30 rounded-full blur-2xl animate-blob move-slow-2"></div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 bg-white/30 backdrop-blur-2xl shadow-2xl rounded-3xl p-10 w-full max-w-3xl">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-purple-700">Contact Us</h1>
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
              className="w-full p-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70"
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
              className="w-full p-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-800 font-semibold">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-800 font-semibold">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full p-3 border border-purple-200 rounded-xl h-40 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70"
            />
          </div>
          <button
  type="submit"
  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 
    hover:from-pink-500 hover:to-purple-500 
    text-white font-bold py-3 rounded-xl 
    shadow-lg hover:shadow-2xl 
    transition-all duration-300 
    transform hover:-translate-y-1 hover:scale-105"
>
  Send Message
</button>

        </form>
      </div>
    </div>
  );
};

export default ContactPage;
