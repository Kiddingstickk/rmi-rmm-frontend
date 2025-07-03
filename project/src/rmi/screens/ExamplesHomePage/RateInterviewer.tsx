import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RateInterviewer = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [rating, setRating] = useState(0);
  const [interviewStatus, setInterviewStatus] = useState('');
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in to submit a review.');
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!name || !company || rating < 1 || !reviewText) {
      alert('Please fill all required fields and give a rating.');
      return;
    }

    try {
      // 1. Create interviewer
      const interviewerRes = await fetch(`${import.meta.env.VITE_API_URL}/api/interviewers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          company,
          position,
        }),
      });

      if (!interviewerRes.ok) throw new Error('Failed to create interviewer');
      const interviewer = await interviewerRes.json();

      // 2. Submit review
      const reviewRes = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/rmi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          interviewerId: interviewer._id,
          rating,
          reviewText,
          interviewStatus,
          anonymous: true,
        }),
      });

      if (!reviewRes.ok) throw new Error('Review submission failed');

      alert('✅ Review submitted successfully!');
      navigate(`/interviewers/${interviewer._id}`);
    } catch (err) {
      console.error(err);
      alert('❌ Something went wrong. Please try again.');
    }
  };

  const StarRating = () => (
    <div className="flex gap-2 text-3xl mt-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className={star <= rating ? 'text-yellow-500' : 'text-gray-300'}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Yellow Header */}
      <div className="flex items-center justify-between bg-yellow-400 py-6 px-10 shadow-md">
        <img src="/rmi-logo.png" alt="RMI Logo" className="w-12 h-12 rounded-full" />
        <h1 className="text-2xl font-bold text-right text-gray-900">
          INPUT YOUR RATING:
        </h1>
      </div>

      {/* Form Section */}
      <main className="flex justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 bg-white p-8 rounded-xl shadow-lg">
          {/* Left: Inputs */}
          <div className="space-y-5 md:col-span-2">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
            <input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
            <input
              type="text"
              placeholder="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Right: Avatar */}
          <div className="flex justify-center items-start">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-5xl text-gray-500 shadow-inner">
              👤
            </div>
          </div>

          {/* Full Width: Rating */}
          <div className="md:col-span-3 mt-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Overall Rating
            </label>
            <StarRating />
          </div>

          {/* Interview Status Dropdown */}
          <div className="md:col-span-3">
            <label className="block text-gray-700 font-semibold mb-2">
              Interview Outcome
            </label>
            <select
              value={interviewStatus}
              onChange={(e) => setInterviewStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select Outcome</option>
              <option value="Cleared">Cleared</option>
              <option value="Not Cleared">Not Cleared</option>
              <option value="Waiting">Waiting</option>
              <option value="No Interview">No Interview</option>
            </select>
          </div>

          {/* Review Textarea */}
          <div className="md:col-span-3">
            <label className="block text-gray-700 font-semibold mb-2">
              Your Review
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={5}
              placeholder="Write your feedback about the interview..."
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-3 flex justify-center">
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-md transition"
            >
              Submit Review
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default RateInterviewer;