import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";

interface InterviewReviewFormProps {
  interviewerId: string;
  existingReview?: {
    _id: string;
    user: string;
    rating: number;
    reviewText: string;
    interviewStatus: string;
    createdAt: string;
    likes: string[];
    dislikes: string[];
  } | null;
  onSuccess?: () => void;
  onCancelEdit?: () => void;
}

const InterviewReviewForm: React.FC<InterviewReviewFormProps> = ({
  interviewerId,
  existingReview,
  onSuccess,
  onCancelEdit,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [interviewStatus, setInterviewStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setReview(existingReview.reviewText);
      setInterviewStatus(existingReview.interviewStatus || "");
    } else {
      setRating(0);
      setReview("");
      setInterviewStatus("");
    }
  }, [existingReview]);

  const handleDelete = async () => {
    if (!existingReview || !window.confirm("Are you sure you want to delete this review?")) return;
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/interviewer-reviews/${existingReview._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed.");

      setMessage("Review deleted.");
      onSuccess?.();
      onCancelEdit?.();
    } catch (err: any) {
      setMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const url = existingReview
        ? `${import.meta.env.VITE_API_URL}/api/interviewer-reviews/${existingReview._id}`
        : `${import.meta.env.VITE_API_URL}/api/reviews/rmi`;

      const method = existingReview ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          interviewerId,
          rating,
          reviewText: review,
          interviewStatus,
          anonymous: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submit failed.");

      setMessage(existingReview ? "Review updated!" : "Review submitted!");
      onSuccess?.();
      onCancelEdit?.();
    } catch (err: any) {
      setMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 cursor-pointer ${rating >= star ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>

      <select
        value={interviewStatus}
        onChange={(e) => setInterviewStatus(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2 text-sm"
        required
      >
        <option value="">Select interview outcome</option>
        <option value="Cleared">Cleared</option>
        <option value="Not Cleared">Not Cleared</option>
        <option value="Waiting">Waiting</option>
        <option value="No Interview">No Interview</option>
      </select>

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Share your interview experience..."
        className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none"
        rows={4}
        required
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading || rating === 0 || review.trim().length === 0}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
        </button>

        {existingReview && (
          <>
            <button
              type="button"
              onClick={onCancelEdit}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </>
        )}
      </div>

      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
};

export default InterviewReviewForm;