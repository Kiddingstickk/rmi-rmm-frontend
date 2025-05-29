// /screens/VerifyOTP.tsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyOTP = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/rmi/verify-otp', { email, otp });
      alert(response.data.message);
      navigate('/signin');
    } catch (error) {
      console.error('OTP verification failed', error);
      alert('OTP verification failed');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center py-10 px-4"
      style={{
        backgroundImage: "url(https://images.unsplash.com/photo-1744977964288-a359e3ca9acc?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)", // <-- Drop your image here
      }}
    >
      <div className="max-w-lg mx-auto p-8 bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl w-full">
        <h2 className="text-4xl font-semibold text-center text-gray-800">Verify Your Email</h2>
        <form onSubmit={handleVerifyOTP} className="space-y-4 mt-16">
          <div>
            <label className="text-lg text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mt-4">
            <label className="text-lg text-gray-700">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md mt-4 w-full transition duration-200"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;


