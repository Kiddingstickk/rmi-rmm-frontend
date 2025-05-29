import React, { useState } from "react";
import { Star } from "lucide-react";

interface ReviewFormProps {
  managerId: string;
  onSuccess?: () => void; // optional callback after successful submission
}

const ReviewForm: React.FC<ReviewFormProps> = ({ managerId, onSuccess }) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/manager-reviews/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          managerId,
          rating,
          reviewText: review,
          anonymous: false,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to submit");

      setMessage("Review submitted successfully!");
      setRating(0);
      setReview("");
      onSuccess?.();
    } catch (err: any) {
      setMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 cursor-pointer ${
              rating >= star ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your feedback..."
        className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none"
        rows={4}
        required
      />

      <button
        type="submit"
        disabled={loading || rating === 0 || review.trim().length === 0}
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>

      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
};

export default ReviewForm;
