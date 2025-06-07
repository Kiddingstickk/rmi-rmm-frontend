// /screens/Register.tsx
import { useState } from 'react';
import api from "../../../lib/api";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // for navigation after successful registration

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/auth/rmi/register', { name, email, password });
      
      alert('OTP sent to your email. Please verify.');
      
      // Save email for use in OTP verification
      localStorage.setItem('pendingEmail', email);
  
      // Navigate to Verify OTP page
      navigate('/verifyotp');
  
    } catch (error) {
      console.error('Registration failed', error);
      alert('Registration failed');
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10 px-4">
      {/* Registration Box with Image as Background */}
      <div
        className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-xl relative w-full"
        style={{
          maxWidth: '500px', // Increased width of the box
          backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1671751034998-700f4f325559?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Register Heading */}
        <h2 className="text-4xl font-semibold text-center text-white absolute top-0 left-1/2 transform -translate-x-1/2 mt-10 z-10">
          Register
        </h2>

        <form onSubmit={handleRegister} className="space-y-4 mt-16 z-10">
          <div>
            <label className="text-lg">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mt-4">
            <label className="text-lg">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mt-4">
            <label className="text-lg">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md mt-4 w-full"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
