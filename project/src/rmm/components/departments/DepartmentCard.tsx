import React from 'react';
import './DepartmentCard.css';
import { FaStar } from 'react-icons/fa';

interface DepartmentCardProps {
  name: string;
  managerCount: number;
  averageRating: number;
}



const DepartmentCard: React.FC<DepartmentCardProps> = ({ name, managerCount, averageRating }) => {
  const parsedRating = Number(averageRating);
  const isValidRating = Number.isFinite(parsedRating);

  return (
    <div className="department-card">
      <div className="department-header">
        <h3>{name}</h3>
        <span className="rating">
          <FaStar className="star-icon" />
          {isValidRating ? parsedRating.toFixed(1) : 'No rating'}
        </span>
      </div>
      <p>{managerCount} Managers</p>
      <button className="view-button">View Managers</button>
    </div>
  );
};

export default DepartmentCard;
