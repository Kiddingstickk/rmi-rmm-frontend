import React from 'react';
import './DepartmentCard.css';
import { FaStar } from 'react-icons/fa';

const DepartmentCard = ({ name, managerCount, averageRating }) => {
  return (
    <div className="department-card">
      <div className="department-header">
        <h3>{name}</h3>
        <span className="rating">
          <FaStar className="star-icon" />
          {averageRating.toFixed(1)}
        </span>
      </div>
      <p>{managerCount} Managers</p>
      <button className="view-button">View Managers</button>
    </div>
  );
};

export default DepartmentCard;
