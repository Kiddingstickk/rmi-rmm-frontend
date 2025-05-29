import Review from '../../rmi/models/Review.js';
import Manager from '../models/Manager.js';

const updateAverageRating = async (managerId) => {
  const reviews = await Review.find({ manager: managerId });
  const total = reviews.reduce((sum, r) => sum + r.ratings.overall, 0);
  const avg = reviews.length ? total / reviews.length : 0;

  await Manager.findByIdAndUpdate(managerId, { averageRating: parseFloat(avg.toFixed(2)) });
};

export default updateAverageRating;
