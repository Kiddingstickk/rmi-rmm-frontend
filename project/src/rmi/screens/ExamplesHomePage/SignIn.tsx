// /screens/SignIn.tsx
import { useState , useEffect } from 'react';
import axios from 'axios';
import { useNavigate , Link } from 'react-router-dom' ; 

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();  // for navigation after successful login
  
  
  useEffect(() => {
    // Redirect if user is already logged in
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/rmi/login', { email, password });
      const token = response.data.token;

      // Store the token in localStorage
      localStorage.setItem('token', token);
      alert('Login successful');
      
      // Redirect to InterviewerProfile (or homepage) after successful login
      navigate('/'); // Change this to any page you want to redirect to

    } catch (error) {
      console.error('Login failed', error);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex justify-center items-center">
      <div
        className="max-w-md w-full p-8 rounded-xl shadow-2xl hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105"
        style={{
          backgroundImage: 'url(https://example.com/your-image.jpg)',  // Add your image URL here
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="bg-white bg-opacity-80 p-8 rounded-xl">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Sign In</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="text-lg text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="text-lg text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Sign In
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
