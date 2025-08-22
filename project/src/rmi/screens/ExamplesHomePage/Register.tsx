// /screens/Register.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/api';
import ResponsiveNavbar from '../../../rmm/components/Navbar/navbar';
import { useAuth } from '../../lib/useAuth';


const { isLoggedIn, logout } = useAuth();

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // 🚀 Navigate immediately to OTP page
    //localStorage.setItem('pendingEmail', email);
    //navigate('/verifyotp');
  
    // 🔄 Fire OTP request in the background
    try {
      const response = await api.post('/auth/rmi/register', { name, email, password });
      if (response.status === 201 || response.status === 200) {
        // ✅ Redirect to login page after successful registration
        navigate('/signin');
      } else {
        setError('Unexpected response. Please try again.');
      }
  
     
    } catch (err) {
      console.error('Registration failed:', err);
      // Optional: you could store a flag to retry, or show a toast later
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 🔶 Header */}

      <ResponsiveNavbar isLoggedIn={isLoggedIn} onLogout={logout} />

      {/* 🧠 Form Section */}
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <form
          onSubmit={handleRegister}
          className="bg-white shadow-md rounded-xl p-8 w-full max-w-md space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center">Create Your Account</h2>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-pastelBlue hover:bg-blue-500 text-black font-semibold py-3 rounded-md transition"
          >
            Register
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <a href="/signin" className="text-blue-600 hover:underline font-medium">
              Sign in
            </a>
          </p>
        </form>
      </main>
    </div>
  );
};

export default Register;