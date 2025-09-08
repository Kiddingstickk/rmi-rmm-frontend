import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../lib/api';
import ResponsiveNavbar from '../../../rmm/components/Navbar/navbar';
import { useAuth } from '../../lib/useAuth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post('/auth/rmi/login', { email, password });
      const token = response.data.token;
      const userId = response.data.user?.id;

      if (!token || !userId) {
        throw new Error('Invalid login response');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);

      alert('Login successful');
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 🔶 Header */}
      <ResponsiveNavbar isLoggedIn={isLoggedIn} onLogout={logout} />

      {/* 🧠 Form Section */}
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-md rounded-xl p-8 w-full max-w-md space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center">Welcome Back!</h2>

          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* 📧 Email */}
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          {/* 🔒 Password */}
          <input
            type="password"
            placeholder="Enter your password."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          {/* ▶ Login */}
          <button
            type="submit"
            className="w-full bg-pastelBlue hover:bg-blue-500 text-black font-semibold py-3 rounded-md transition"
          >
            Log in
          </button>

          <div className="text-right">
            <a href="#" className="text-sm text-gray-700 hover:underline">
              Forgot your password?
            </a>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default SignIn;