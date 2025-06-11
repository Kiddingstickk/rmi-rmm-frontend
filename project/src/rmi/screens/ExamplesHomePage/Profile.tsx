// src/pages/Profile.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // for animation!

interface User {
  _id: string;
  name: string;
  email: string;
  totalReviews: number;
  tokens: number;
  createdAt: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const fetched: User = {
        _id: data.id,
        name: data.name,
        email: data.email,
        totalReviews: data.totalReviews,
        tokens: data.tokens,
        createdAt: data.createdAt,
      };
      setUser(fetched);
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div className="p-10 text-center text-xl">Loading your profile...</div>;
  }

  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-400 via-pink-300 to-blue-300 flex items-center justify-center p-6">
      <motion.div 
        className="backdrop-blur-md bg-white/30 rounded-3xl shadow-2xl p-10 max-w-2xl w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-extrabold text-center text-white mb-8">✨ Your Profile ✨</h1>

        <div className="space-y-6 text-white text-lg">
          <div className="flex items-center">
            <span className="mr-3">👤</span> <span><strong>Name:</strong> {user.name}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-3">📧</span> <span><strong>Email:</strong> {user.email}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-3">📝</span> <span><strong>Reviews Submitted:</strong> {user.totalReviews}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-3">🎁</span> <span><strong>Tokens Earned:</strong> {user.tokens}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-3">📅</span> <span><strong>Account Created:</strong> {formattedDate}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
