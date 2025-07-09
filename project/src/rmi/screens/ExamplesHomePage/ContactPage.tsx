import { useState } from 'react';
import axios from 'axios';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, {
        name,
        email,
        subject,
        message,
      });

      setStatus('✅ Message sent successfully!');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
      setStatus('❌ Failed to send message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 🔶 Header */}
      <header className="bg-pastelYellow flex items-center justify-between px-8 py-6 shadow-md">
        <img src="/favicon.png" alt="RMI Logo" className="w-12 h-12 rounded-full" />
        <h1 className="text-xl font-bold text-black">CONTACT US:</h1>
      </header>

      {/* ✉️ Form Section */}
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl p-8 w-full max-w-lg space-y-5"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center">We’d love to hear from you</h2>

          {status && <p className="text-center text-sm text-gray-600">{status}</p>}

          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          <textarea
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full border border-gray-300 rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-pastelYellow hover:bg-yellow-500 text-black font-semibold py-3 rounded-md transition"
          >
            Send Message
          </button>
        </form>
      </main>
    </div>
  );
};

export default ContactPage;