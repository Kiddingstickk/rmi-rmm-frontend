import express from 'express';
import auth from '../../shared/middleware/auth.js';
import {
  submitReview,
  updateReview,
  deleteReview,
  getManagerReviews,
  likeReview,
  dislikeReview,
  flagManager,
} from '../controllers/managerReviewController.js';

const router = express.Router();

// Submit a new review
router.post('/submit', auth, submitReview);

// Update an existing review
router.put('/:reviewId', auth, updateReview);

// Delete a review
router.delete('/:reviewId', auth, deleteReview);

// Get all reviews for a specific manager
router.get('/manager/:managerId', getManagerReviews);

// Like/dislike/flag review
router.post('/like/:reviewId', auth, likeReview);
router.post('/dislike/:reviewId', auth, dislikeReview);
router.post('/flag/:reviewId', auth, flagManager);

router.get('/test', (req, res) => {
  res.send('Review route works!');
});


export default router;
