import express from 'express';
import Review from '../models/Review.js';
import  auth  from '../../shared/middleware/auth.js';

const router = express.Router();

// @desc    Get all reviews posted by logged-in user
// @route   GET /api/reviews/my-reviews
// @access  Private
router.get('/my-reviews', auth , async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id }).populate('interviewer', 'name position company');

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
