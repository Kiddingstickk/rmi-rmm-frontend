import React from "react";
import { Star } from "lucide-react";

interface ManagerCardProps {
  name: string;
  department: string;
  position: string;
  averageRating: number;
  onClick?: () => void;
}

const getRatingColor = (rating: number) => {
  if (rating >= 4.5) return "text-green-600";
  if (rating >= 3) return "text-yellow-500";
  return "text-red-500";
};

const ManagerCard: React.FC<ManagerCardProps> = ({
  name,
  department,
  position,
  averageRating,
  onClick,
}) => {
  const isValidRating = Number.isFinite(averageRating);

  const safeDepartment = department || "Unknown";


  console.log("ManagerCard props:", {
    name,
    department,
    position,
    averageRating,
    parsedRating: Number(averageRating),
    isFinite: Number.isFinite(Number(averageRating)),
    type: typeof averageRating,
  });
  



  return (
    <div
      className="bg-white rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg transition"
      onClick={onClick}
    >
      <h2 className="text-xl font-bold text-gray-800">{name}</h2>
      <p className="text-gray-500">{position}</p>
      <p className="text-sm text-gray-400 mb-3">{safeDepartment}</p>

      <div className="flex items-center gap-1">
        <Star
          className={`w-5 h-5 ${isValidRating ? getRatingColor(averageRating) : "text-gray-300"}`}
          fill={isValidRating ? "currentColor" : "none"}
        />
        
        {isValidRating ? (
          <span className={`font-semibold ${getRatingColor(averageRating)}`}>
            {averageRating.toFixed(1)} / 5
          </span>
        ) : (
          <span className="text-gray-400 font-semibold">No rating</span>
        )}
        
      </div>
    </div>
  );
};

export default ManagerCard;
