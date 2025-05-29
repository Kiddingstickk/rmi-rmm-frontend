import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ReviewSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const interviewStatus = location.state?.interviewStatus || 'cleared';

  useEffect(() => {
    const timer = setTimeout(() => {
      if (interviewStatus === 'did_not_attend') {
        navigate('/profile'); // or navigate('/');
      } else {
        navigate('/my-rewards');
      }
    }, 5000); // wait for 5 seconds after showing animation/message
    return () => clearTimeout(timer);
  }, [interviewStatus, navigate]);

  const renderContent = () => {
    if (interviewStatus === 'cleared') {
      return (
        <div className="flex flex-col items-center">
          {/* Animated Gift Box */}
          <motion.img
            src="/giftbox.png"  // Put a giftbox image in your public folder
            alt="Gift Box"
            initial={{ scale: 0 }}
            animate={{ scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 100, damping: 10 }}
            className="w-32 h-32 mb-6"
          />
          {/* Tokens Bursting */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-purple-700 font-bold text-2xl"
          >
            🎉 You earned bonus tokens!
          </motion.div>
        </div>
      );
    } else if (interviewStatus === 'not_cleared') {
      return (
        <p className="text-gray-700 text-xl font-semibold">
          "Success is not final, failure is not fatal: it is the courage to continue that counts." 💪
        </p>
      );
    } else if (interviewStatus === 'waiting') {
      return (
        <p className="text-gray-700 text-xl font-semibold">
          "Good things come to those who wait. Keep believing in yourself!" ⏳
        </p>
      );
    } else {
      return (
        <p className="text-gray-700 text-xl font-semibold">
          Real experiences create real impact. Kindly review after an interview! 🚫
        </p>
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-300 to-white p-10">
      <div className="bg-white shadow-2xl rounded-3xl p-10 text-center max-w-xl animate-fadeIn">
        <h1 className="text-4xl font-bold mb-6 text-purple-700">Thank You!</h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default ReviewSuccess;
