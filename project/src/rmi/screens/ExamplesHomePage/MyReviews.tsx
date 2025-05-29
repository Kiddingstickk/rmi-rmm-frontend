import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Review {
  interviewerId: string;
  interviewerName: string;
  company: string;
  rating: number;
  review: string;
  date: string;
}

const MyReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');
        const res = await fetch('http://localhost:5000/api/user/my-reviews', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.message || `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error('Unexpected response format');
        }
        setReviews(data);
      } catch (err: any) {
        console.error('Error loading reviews:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleReviewClick = (interviewerId: string) => {
    // Navigate to the interviewer's profile page
    navigate(`/interviewers/${interviewerId}`);
  };

  if (loading) {
    return <div className="p-10 text-center text-xl">Loading your reviews…</div>;
  }
  if (error) {
    return <div className="p-10 text-center text-xl text-red-600">Error: {error}</div>;
  }
  if (reviews.length === 0) {
    return <div className="p-10 text-center text-xl">No reviews posted yet.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-white p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">My Reviews</h1>
        <div className="space-y-8">
          {reviews.map((r) => (
            <div
              key={r.interviewerId + r.date}
              className="bg-white shadow-lg rounded-xl p-8 cursor-pointer hover:bg-purple-50 hover:shadow-2xl transition ease-in-out duration-300"
              onClick={() => handleReviewClick(r.interviewerId)} // Handle the click event
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-purple-700">{r.interviewerName}</h2>
                <div className="flex items-center">
                  <span className="text-yellow-400 text-lg">{r.rating} ⭐</span>
                </div>
              </div>
              <p className="text-gray-600 text-lg mt-2">{r.company}</p>
              <p className="mt-6 text-gray-800 text-base leading-relaxed">{r.review}</p>
              <p className="mt-4 text-sm text-gray-500">Reviewed on {new Date(r.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyReviews;
