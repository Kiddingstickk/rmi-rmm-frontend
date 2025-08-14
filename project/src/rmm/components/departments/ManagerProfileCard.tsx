import React from "react";
import { Star, Flag } from "lucide-react";
import api from "../../../lib/api";


interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  reviewText: string;
  rating: number;
  anonymous: boolean;
  createdAt: string;
}


interface ManagerProfileCardProps {
  name: string;
  department: string;
  position: string;
  averageRating: number;
  reviews: Review[];
  userReviewForm: React.ReactNode;
  currentUserId: string;
  managerId: string; 
  onReviewDeleted?: (deletedReviewId: string) => void;
}

const getRatingColor = (rating: number) => {
  if (rating >= 4.5) return "text-green-600";
  if (rating >= 3) return "text-yellow-500";
  return "text-red-500";
};

const ManagerProfileCard: React.FC<ManagerProfileCardProps> = ({
  name,
  department,
  position,
  averageRating,
  reviews,
  userReviewForm,
  currentUserId,
  managerId,
  onReviewDeleted,
}) => {
  const isValidRating = typeof averageRating === "number";
  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?"))
      return;

    try {
      const res = await api.delete(`${import.meta.env.VITE_API_URL}/manager-reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

     

     
      if (onReviewDeleted) onReviewDeleted(reviewId);

      alert("Review deleted successfully.");
    } catch (err: any) {
      console.error("Delete error:", err.response?.data || err.message);
      alert("Failed to delete review. Please try again.");
    }
  };


  const handleFlagManager = async () => {
    if (!window.confirm("Do you really want to flag this manager?")) return;
    try {
      const res = await api.post(
        `${import.meta.env.VITE_API_URL}/manager-reviews/flag/${managerId}`,
        {}, 
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    
      
      alert("Manager flagged successfully.");
    } catch (err: any) {
      console.error("Flag error:", err.response?.data || err.message);
      const msg =
        err.response?.data?.message || "Failed to flag manager. Please try again.";
      alert(msg);
    }
  };



  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
      <p className="text-gray-600">{position}</p>
      <p className="text-sm text-gray-400 mb-4">{department}</p>

      <div className="flex items-center gap-1 mb-4">
        <Star
          className={`w-5 h-5 ${isValidRating ? getRatingColor(averageRating) : "text-gray-300"}`}
          fill={isValidRating ? "currentColor" : "none"}
        />
        <span className={`font-semibold ${isValidRating ? getRatingColor(averageRating) : "text-gray-400"}`}>
          {isValidRating ? `${averageRating.toFixed(1)} / 5` : "No rating yet"}
        </span>
      </div>

      {/* Flag Button */}
      <button
        className="flex items-center gap-1 px-3 py-1 text-xs text-red-500 border border-red-500 rounded hover:bg-red-50 mb-4"
        onClick={handleFlagManager}
      >
        <Flag className="w-4 h-4" /> Flag Manager
      </button>



      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2 text-gray-700">Your Review</h3>
        {userReviewForm}
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2 text-gray-700">What others say</h3>
        {reviews.length > 0 ? (
  reviews.map((r, i) => (
    <div key={i} className="border border-gray-200 rounded-md p-3 mb-3 bg-gray-50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">
          {r.anonymous ? 'Anonymous' : r.userId?.name || 'User'}
        </span>
        <span className="text-sm text-gray-500">{r.rating}★</span>
      </div>
      <p className="text-sm text-gray-600 mt-1">{r.reviewText}</p>
      <p className="text-xs text-gray-400 mt-1">
        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Unknown date'}
      </p>
    </div>
  ))
) : (
  <p className="text-gray-500 text-sm">No reviews yet.</p>
)}

      </div>
    </div>
  );
};

export default ManagerProfileCard;
