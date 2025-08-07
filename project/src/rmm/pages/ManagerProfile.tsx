import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../lib/api";
import ReviewForm from "../components/departments/ReviewForm";
import Navbar from '../components/Navbar/navbar';
import { useAuth } from '../../rmi/lib/useAuth';
import { Link } from "react-router-dom";

const { isLoggedIn, logout } = useAuth();

interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  reviewText: string;
  reviewLeadership: string;
  reviewCommunicationText: string;
  reviewSupport: string;
  rating: number;
  leadership: number;
  communication: number;
  teamwork: number;
  empathy: number;
  fairness: number;
  anonymous: boolean;
  createdAt: string;
  likes: string[];
  dislikes: string[];
  isOwnReview?: boolean;
}

interface Manager {
  _id: string;
  name: string;
  position: string;
  department: {
    _id: string;
    name: string;
  };
  company?: {
    _id: string;
    name: string;
  };
  branch?: {
    _id: string;
    city: string;
    location?: string;
  };
  averageRating?: number;
  reviews: Review[];
}

const renderStars = (rating: number) => (
  <div className="flex text-blue-500">
    {[...Array(5)].map((_, i) =>
      i < rating ? (
        <span key={i}>★</span>
      ) : (
        <span key={i} className="text-gray-300">★</span>
      )
    )}
  </div>
);

const getReviewAverage = (review: Review) => {
  const values = [
    review.leadership,
    review.communication,
    review.teamwork,
    review.empathy,
    review.fairness
  ];
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};



const ManagerProfile = () => {
  const { id } = useParams();
  const [manager, setManager] = useState<Manager | null>(null);
  const userId = localStorage.getItem("userId") || '';
  const token = localStorage.getItem("token");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (id) fetchManager();
  }, [id]);

  const fetchManager = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/managers/${id}`);
      const data = await res.json();

      // Normalize likes/dislikes inside reviews
      const reviews = data.reviews.map((r: any) => ({
        ...r,
        likes: Array.isArray(r.likes) ? r.likes.length : 0,
        dislikes: Array.isArray(r.dislikes) ? r.dislikes.length : 0,
      }));
  
      
      const managerWithReviews = {
        ...data.manager,
        reviews
      };
  
      setManager(managerWithReviews);
    } catch (error) {
      console.error("Failed to fetch manager", error);
    }
  };


  const handleLike = async (reviewId: string) => {
    try {
      await api.post(
        `${import.meta.env.VITE_API_URL}/api/manager-reviews/like/${reviewId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchManager();
    } catch (err) {
      console.error("Error liking review:", err);
    }
  };

  const handleDislike = async (reviewId: string) => {
    try {
      await api.post(
        `${import.meta.env.VITE_API_URL}/api/manager-reviews/dislike/${reviewId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchManager();
    } catch (err) {
      console.error("Error disliking review:", err);
    }
  };

  const totalReviews = manager?.reviews.length || 0;
  const avgRating = totalReviews > 0
    ? manager!.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  const userReview = manager?.reviews.find((r) => r.isOwnReview);

  const dimensionLabels: (keyof Pick<Review, 'leadership' | 'communication' | 'teamwork' | 'empathy' | 'fairness'>)[] = [
    'leadership',
    'communication',
    'teamwork',
    'empathy',
    'fairness'
  ];



  return (
    <div className="bg-white min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} onLogout={logout} />


      <section className="max-w-5xl mx-auto px-6 py-10 bg-white rounded-xl shadow-lg mt-6">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800">{manager?.name}</h2>
            <div className="mt-2 space-y-1 text-sm text-gray-700">
              <p>
                <span className="font-medium">Position:</span>{' '}
                <span className="text-blue-700">{manager?.position}</span>
              </p>
              <p>
                <span className="font-medium">Company:</span>{' '}
                {manager?.company?._id && manager.company.name ? (
                  <Link
                  to={`/companies/${manager.company.name.toLowerCase().replace(/\s+/g, "-")}/${manager.company._id}`}
                    className="text-yellow-700 hover:underline"
                  >
                    {manager.company.name}
                  </Link>
                ) : (
                  <span className="text-gray-500 italic">Unknown</span>
                )}
              </p>

              <p>
                <span className="font-medium">Branch:</span>{' '}
                <span className="text-purple-700">
                  {manager?.branch?.city}
                  {manager?.branch?.location ? ` – ${manager.branch.location}` : ''}
                </span>
              </p>
            </div>

            <div className="mt-3 flex items-center gap-2 text-2xl">
              {renderStars(Math.round(avgRating))}
              <span className="text-gray-800 text-lg font-semibold ml-2">
                {avgRating.toFixed(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Overall rating based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
            </p>
            <div className="mt-4 flex gap-3">
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                disabled={showForm}
                className="bg-blue-400 px-6 py-2 rounded-md font-semibold hover:bg-blue-500 disabled:opacity-50"
              >
                {userReview ? "Edit Review" : "Rate"}
              </button>
            )}
              <button className="bg-gray-200 px-6 py-2 rounded-md font-semibold hover:bg-gray-300">
                Save
              </button>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Rating Distribution</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const label = ['Awesome', 'Great', 'Good', 'OK', 'Awful'][5 - star];
                const count = manager?.reviews.filter((r) => r.rating === star).length || 0;
                return (
                  <div key={star} className="flex items-center justify-between">
                    <div className="w-24 text-sm font-medium text-gray-700">{label}</div>
                    <div className="flex gap-1 text-blue-400 text-sm">{'★'.repeat(star)}</div>
                    <div className="relative w-full h-3 bg-gray-200 rounded mx-4">
                      <div
                        className="absolute h-3 bg-blue-400 rounded"
                        style={{
                          width:
                            totalReviews > 0
                              ? `${(count / totalReviews) * 100}%`
                              : '0%'
                        }}
                      />
                    </div>
                    <div className="text-sm font-medium text-gray-700 w-6 text-right">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Inline Review Form */}
        {showForm && manager?._id && (
          <div className="mt-10">
          <ReviewForm
            managerId={manager._id}
            existingReview={userReview || null}
            onSuccess={() => {
              fetchManager();
              setShowForm(false);
            }}
            onCancelEdit={() => setShowForm(false)}
          />
          </div>
        )}
        {showForm && (
        <button
          onClick={() => setShowForm(false)}
          className="mt-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        )}
      </section>

      <section className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        {manager?.reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white shadow-md p-6 rounded-xl border border-gray-200"
          >
            <div className="flex items-center gap-2 text-blue-500 text-xl mb-2">
              {renderStars(review.rating)}
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
            {dimensionLabels.map((key) => (
              <div key={key} className="flex items-center justify-between">
                <span className="capitalize">{key}</span>
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < review[key] ? "★" : "☆"}</span>
                  ))}
                </div>
              </div>
            ))}
            </div>
            {review.reviewLeadership && (
              <p className="text-sm text-gray-700 mt-2">
                <strong>Leadership:</strong> {review.reviewLeadership}
              </p>
            )}
            {review.reviewCommunicationText && (
              <p className="text-sm text-gray-700 mt-1">
                <strong>Communication:</strong> {review.reviewCommunicationText}
              </p>
            )}
            {review.reviewSupport && (
              <p className="text-sm text-gray-700 mt-1">
                <strong>Support:</strong> {review.reviewSupport}
              </p>
            )}
            <p className="text-gray-700 mb-2 italic">"{review.reviewText}"</p>
            <p className="text-sm text-gray-500 mb-2">
              Submitted on {new Date(review.createdAt).toLocaleDateString()}
            </p>
            <div className="flex gap-4 text-sm text-gray-600">
            <button onClick={() => handleLike(review._id)}>👍 {review.likes?.length || 0}</button>
            <button onClick={() => handleDislike(review._id)}>👎 {review.dislikes?.length || 0}</button>
            </div>
          </div>
        ))}
        <div className="flex justify-center pt-6">
          <button className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded font-medium">
            See More
          </button>
        </div>
      </section>
    </div>
  );
};

export default ManagerProfile;
