// /screens/SignIn.tsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from "../../../lib/api";

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

      if (userId) {
        localStorage.setItem('userId', userId);
      } else {
        console.error('Failed to extract userId from response', response.data);
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      alert('Login successful');
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Welcome Back</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-md hover:bg-indigo-700 transition"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
  
};

export default SignIn;
