import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewForm from "../components/departments/ReviewForm";



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
  userId: string;
  rating: number;
  review: string;
  createdAt: string;
  likes: number;
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

  const fetchManager = async () => {
    try {
      const res = await fetch(`/api/rmm/managers/${id}`);
      const data = await res.json();
      setManager(data);
      console.log("Department object:", data.department);

    } catch (error) {
      console.error("Failed to fetch manager", error);
      

    }
  };

  useEffect(() => {
    console.log("Manager ID from route params:" , id);
    if (id) fetchManager();
  }, [id]);
  console.log("Manager object:", manager);

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
            <h2 className="text-xl font-semibold mb-4">Submit Your Review</h2>
            <ReviewForm managerId={manager._id} onSuccess={fetchManager} />
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">User Reviews</h2>
            {manager.reviews?.length > 0 ? (
              manager.reviews.map((rev, i) => (
                <div key={i} className="border-b pb-3 mb-3">
                  <p className="font-semibold">Rating: {rev.rating} / 5</p>
                  <p>{rev.review}</p>
                  <p className="text-xs text-gray-400">Posted on {new Date(rev.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading manager...</p>
      )}
    </div>
  );
};

export default ManagerProfile;
