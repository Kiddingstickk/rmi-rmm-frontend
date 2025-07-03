// InterviewerProfile.tsx (Part 1 of 2)
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: string;
  exp: number;
  name: string;
}

interface ReviewType {
  _id: string;
  rating: number;
  reviewText: string;
  interviewStatus: string;
  createdAt: string;
  user: string;
  likes: string[];
  dislikes: string[];
}

interface Interviewer {
  _id: string;
  name: string;
  position: string;
  company: string;
}

const calculateWeightedRating = (ratings: ReviewType[]) => {
  if (!ratings.length) return 0;
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  const rawAvg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  const weight = sigmoid(ratings.length / 5);
  const globalAvg = 3;
  return parseFloat(((1 - weight) * globalAvg + weight * rawAvg).toFixed(2));
};

const renderStars = (rating: number) => {
  return (
    <div className="flex text-yellow-500">
      {[...Array(5)].map((_, i) =>
        i < rating ? <AiFillStar key={i} /> : <AiOutlineStar key={i} className="text-gray-300" />
      )}
    </div>
  );
};

const InterviewerProfile = () => {
  const { id } = useParams();
  const [interviewer, setInterviewer] = useState<Interviewer | null>(null);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userReview, setUserReview] = useState<ReviewType | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchInterviewer = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/interviewers/${id}`);
        setInterviewer(res.data);
      } catch (err) {
        console.error('Failed to fetch interviewer');
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/rmi?interviewerId=${id}`);
        setReviews(res.data);
      } catch (err) {
        console.error('Failed to fetch reviews');
      }
    };

    const decodeToken = () => {
      if (!token) return;
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUserId(decoded.userId);
      } catch (err) {
        console.error('Token decode failed');
      }
    };

    fetchInterviewer();
    fetchReviews();
    decodeToken();
  }, [id]);

  useEffect(() => {
    if (userId && reviews.length) {
      const match = reviews.find((r) => r.user === userId);
      setUserReview(match || null);
    }
  }, [reviews, userId]);

  const avgRating = calculateWeightedRating(reviews);
  // ...continued from Part 1

  const handleLike = async (reviewId: string) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/interviewers/${id}/reviews/${reviewId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/rmi?interviewerId=${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const handleDislike = async (reviewId: string) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/interviewers/${id}/reviews/${reviewId}/dislike`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/rmi?interviewerId=${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error('Dislike failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 🟡 Header */}
      <header className="bg-yellow-400 flex justify-between items-center px-8 py-6 shadow-md">
        <img src="/rmi-logo.png" alt="RMI Logo" className="w-12 h-12 rounded-full" />
        <h1 className="text-xl md:text-2xl font-bold text-right text-gray-900 uppercase">
          Interviewer Profile:
        </h1>
      </header>

      {/* 👤 Interviewer Summary */}
      <section className="max-w-5xl mx-auto px-6 py-10 bg-white rounded-xl shadow-lg mt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{interviewer?.name}</h2>
            <p className="text-gray-600 mt-1">{interviewer?.position}, {interviewer?.company}</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-3">
            <button className="bg-yellow-400 px-6 py-2 rounded-md font-semibold hover:bg-yellow-500">
              Rate
            </button>
            <button className="bg-gray-200 px-6 py-2 rounded-md font-semibold hover:bg-gray-300">
              Save
            </button>
          </div>
        </div>

        {/* ⭐ Average Rating */}
        <div className="mt-8 border-t pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-yellow-500 text-2xl">
              {renderStars(Math.round(avgRating))}
              <span className="text-gray-800 text-lg font-semibold ml-2">{avgRating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-gray-500">{reviews.length} ratings</p>
          </div>

          {/* 📊 Rating Distribution */}
          <div className="mt-6 space-y-4">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviews.filter((r) => r.rating === stars).length;
              return (
                <div key={stars} className="flex items-center justify-between">
                  <div className="w-28 flex-shrink-0 text-sm font-medium text-gray-700">
                    {['Awful', 'OK', 'Good', 'Great', 'Awesome'][5 - stars]}
                  </div>
                  <div className="flex gap-1 text-yellow-400 text-sm">
                    {'★'.repeat(stars)}
                  </div>
                  <div className="relative w-full h-3 bg-gray-200 rounded mx-4">
                    <div
                      className="absolute h-3 bg-yellow-400 rounded"
                      style={{ width: `${(count / reviews.length) * 100 || 0}%` }}
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 w-6 text-right">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 💬 Reviews Section */}
      <section className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white shadow-md p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 text-yellow-500 text-xl mb-2">
              {renderStars(review.rating)}
            </div>
            <p className="text-gray-700 mb-2 italic">"{review.reviewText}"</p>
            <p className="text-sm text-gray-500 mb-2">Submitted on {new Date(review.createdAt).toLocaleDateString()}</p>
            <div className="flex gap-4 text-sm text-gray-600">
              <button onClick={() => handleLike(review._id)}>👍 {review.likes?.length || 0}</button>
              <button onClick={() => handleDislike(review._id)}>👎 {review.dislikes?.length || 0}</button>
            </div>
          </div>
        ))}

        {/* 🔘 See More */}
        <div className="flex justify-center pt-6">
          <button className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded font-medium">
            See More
          </button>
        </div>
      </section>
    </div>
  );
};

export default InterviewerProfile;