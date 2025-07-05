import express from 'express';
import Review from '../models/Review.js';
import auth from '../../shared/middleware/auth.js';

const router = express.Router();

// 🔒 Get all reviews posted by logged-in user
router.get('/my-reviews', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('interviewer', 'name position company');
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 📝 Submit a new review for an interviewer
router.post('/', auth, async (req, res) => {
  try {
    console.log('REQ.BODY:', req.body);
    console.log('REQ.USER:', req.user);

    const { interviewerId, rating, reviewText, interviewStatus, anonymous } = req.body;

    if (!interviewerId || !rating || !reviewText) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // 🔐 Prevent duplicate reviews
    const existingReview = await Review.findOne({
      interviewer: interviewerId,
      user: req.user.id,
    });

    if (existingReview) {
      return res.status(400).json({
        message: 'You’ve already submitted a review for this interviewer.',
        review: existingReview,
      });
    }

    const newReview = new Review({
      interviewer: interviewerId,
      user: req.user.id,
      rating,
      reviewText,
      interviewStatus,
      anonymous: anonymous ?? true,
    });

    await newReview.save();
    res.status(201).json({ message: 'Review submitted', review: newReview });
  } catch (err) {
    console.error('Review submission failed:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 🔎 Get all reviews for a specific interviewer
router.get('/', async (req, res) => {
  try {
    const { interviewerId } = req.query;

    if (!interviewerId) {
      return res.status(400).json({ message: 'interviewerId is required' });
    }

    const reviews = await Review.find({ interviewer: interviewerId })
      .sort({ createdAt: -1 })
      .populate('user', 'name')
      .lean();

    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;