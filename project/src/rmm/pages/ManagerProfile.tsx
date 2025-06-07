import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewForm from "../components/departments/ReviewForm";
//import auth  from "../../../backend/shared/middleware/auth.js";

import api from "../../lib/api";

// Types defined inside the same file

interface Department {
  _id: string;
  name: string;
  description: string;
  managers: string[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

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
  likes: number;      // counts only
  dislikes: number; 
}




interface Manager {
  _id: string;
  name: string;
  department: Department;
  position: string;
  averageRating?: number;
  reviews: Review[];
}









const ManagerProfile = () => {
  const { id } = useParams(); // and then use id in fetch URL
  const [manager, setManager] = useState<Manager | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const userId = localStorage.getItem('userId'); 
  const token = localStorage.getItem('token');


  useEffect(() => {
    console.log("Manager ID from route params:" , id);
    if (id) fetchManager();
  }, [id]);

  const fetchManager = async () => {
    try {
      const res = await fetch(`/api/rmm/managers/${id}`);
      const data = await res.json();

      // Convert likes/dislikes arrays to counts
      data.reviews = data.reviews.map((r: any) => ({
        ...r,
        likes: r.likes.length,
        dislikes: r.dislikes.length
      }));

      setManager(data);
    } catch (error) {
      console.error("Failed to fetch manager", error);
    }
  };

  const handleLike = async (reviewId: string) => {
    try {
      await axios.post(`/api/manager-reviews/like/${reviewId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchManager();
    } catch (err) {
      const error = err as AxiosError;
      console.error('Error liking review:', error.response?.data || error.message);
    }
  };

  const handleDislike = async (reviewId: string) => {
    try {
      await axios.post(`/api/manager-reviews/dislike/${reviewId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchManager();
    } catch (err) {
      const error = err as AxiosError;
      console.error('Error disliking review:', error.response?.data || error.message);
    }
  };




  console.log("Manager object:", manager);
  // userId is string, e.g. '6833550dd9a79790f77a279a'
  console.log('Logged-in user id:', userId);


  return (
    <div className="max-w-3xl mx-auto p-6">
      {manager ? (
        <>
          <div className="bg-white p-6 rounded shadow mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{manager.name}</h1>
            <p className="text-gray-500">{manager.position}</p>
            <p className="text-sm text-gray-400 mb-3">{manager.department.name}</p>
            <p className="text-lg font-semibold">
              Average Rating:{" "}
              <span className={
                  manager?.averageRating! >= 4.5 ? "text-green-600" :
                  manager?.averageRating! >= 3 ? "text-yellow-500" :
                  "text-red-500"
                }>
                  {manager?.averageRating?.toFixed(1)} / 5
              </span>

            </p>
          </div>

          <div className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">{editingReview ? "Update Your Review" : "Submit Your Review"}</h2>
            <ReviewForm managerId={manager._id}  onSuccess={() => {
                fetchManager();
                setEditingReview(null);
              }}
              existingReview={editingReview}
              onCancelEdit={() => setEditingReview(null)} />
          </div>


          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">User Reviews</h2>
            {manager.reviews?.length > 0 ? (() => {
    const sortedReviews = [...manager.reviews];
    const userReviewIndex = sortedReviews.findIndex(
      (rev) =>
        (typeof rev.userId === "string" ? rev.userId : rev.userId?._id) === userId
    );

    if (userReviewIndex !== -1) {
      const [userReview] = sortedReviews.splice(userReviewIndex, 1);
      sortedReviews.unshift(userReview);
    }

    return sortedReviews.map((rev, i) =>(
                <div key={i} className="border-b pb-3 mb-3">
                  <p className="font-semibold">Rating: {rev.rating} / 5</p>
                  <p>{rev.reviewText}</p>
                  <p className="text-xs text-gray-400">Posted on {new Date(rev.createdAt).toLocaleDateString()}</p>

                  <div className="flex items-center mt-2 gap-4">
                    <button
                      onClick={() => handleLike(rev._id)}
                      className="text-green-600 hover:underline text-sm"
                    >
                      👍{rev.likes}
                    </button>
                    <button
                      onClick={() => handleDislike(rev._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      👎{rev.dislikes}
                    </button>
                  </div>



                  {rev.userId._id === userId && (
                    <button
                      onClick={() => setEditingReview(rev)}
                      className="text-blue-500 hover:underline mt-1"
                    >
                      Update
                    </button>
                  )}
                </div>
             ));
            })() : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </>
      )  : (
        <p>Loading manager...</p>
      )}
    </div>
  );
};

export default ManagerProfile;
