import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RateInterviewer = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [rating, setRating] = useState(0);
  const [interviewStatus, setInterviewStatus] = useState('');
  const [reviewText, setReviewText] = useState('');

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
        <form className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 bg-white p-8 rounded-xl shadow-lg">
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

          {/* Full Width: Interview Status Dropdown */}
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
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>

          {/* Full Width: Review Textarea */}
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

          {/* Full Width: Submit Button */}
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