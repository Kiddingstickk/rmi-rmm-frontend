// backend/rmm/controllers/managerReviewController.js
import Manager from '../models/Manager.js';
import ManagerReview from '../models/ManagerReview.js';
import mongoose from 'mongoose';

export const submitReview = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. User not found.' });
    }
    
    const { managerId, rating, reviewText, anonymous } = req.body;

    const existingReview = await ManagerReview.findOne({ userId, managerId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this manager.' });
    }
    console.log('Authenticated user:', req.user);

    const newReview = new ManagerReview({
      userId,
      managerId,
      rating,
      reviewText,
      anonymous,
    });
    
    await newReview.save();
    console.log('Reviewing manager with ID:', managerId);


    const manager = await Manager.findById(managerId);
    if (!manager) return res.status(404).json({ message: 'Manager not found' });

    manager.reviews.push(newReview._id);

    const allReviews = await ManagerReview.find({ managerId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    manager.averageRating = avgRating;

    await manager.save();
    res.status(201).json({ message: 'Review submitted successfully.' });
  } catch (error) {
    console.error('Submit Review Error:', error);
    res.status(500).json({ message: 'Server error while submitting review.' });
  }
};
// Update review
export const updateReview = async (req, res) => {
  const { rating, reviewText, anonymous } = req.body;
  try {
    const review = await ManagerReview.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    review.rating = rating;
    review.reviewText = reviewText;
    review.anonymous = anonymous;
    await review.save();
    await updateAverageRating(review.managerId);

    res.status(200).json({ message: 'Review updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const flagManager = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { managerId } = req.body;

    if (!userId || !managerId) {
      return res.status(400).json({ message: 'Missing userId or managerId' });
    }

    // Convert IDs to ObjectId
    const review = await ManagerReview.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      managerId: new mongoose.Types.ObjectId(managerId),
    });
    console.log('userId:', userId);
    console.log('managerId:', managerId);    
    console.log('Review found in flagManager:', review);

    if (!review) {
      return res.status(403).json({ message: 'You must submit a review before flagging.' });
    }

    const now = new Date();
    const lastFlagTime = review.lastFlagTime || new Date(0);
    const diffHours = (now - lastFlagTime) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return res.status(429).json({ message: 'You can only flag once every 24 hours.' });
    }

    review.flags = (review.flags || 0) + 1;
    review.lastFlagTime = now;
    await review.save();

    const manager = await Manager.findById(managerId);
    manager.flagCount = (manager.flagCount || 0) + 1;
    await manager.save();

    res.status(200).json({ message: 'Manager flagged successfully.' });
  } catch (error) {
    console.error('Flag Error:', error);
    res.status(500).json({ message: 'Server error while flagging manager.' });
  }
};


export const getManagerReviews = async (req, res) => {
  try {
    const { managerId } = req.params;
    if (!managerId) {
      return res.status(400).json({ message: 'Manager ID is required.' });
    }

    const reviews = await ManagerReview.find({ managerId })
      .select('reviewText rating createdAt')
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching simple reviews:', error);
    res.status(500).json({ message: 'Server error while fetching simple reviews.' });
  }
};

export const likeReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { reviewId } = req.params;

    const review = await ManagerReview.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const liked = review.likes.includes(userId);
    if (liked) {
      review.likes.pull(userId);
    } else {
      review.likes.push(userId);
      review.dislikes.pull(userId);
    }

    await review.save();
    res.status(200).json({ message: 'Like updated.', likes: review.likes.length, dislikes: review.dislikes.length });
  } catch (error) {
    console.error('Like Error:', error);
    res.status(500).json({ message: 'Server error while liking review.' });
  }
};

export const dislikeReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { reviewId } = req.params;

    const review = await ManagerReview.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const disliked = review.dislikes.includes(userId);
    if (disliked) {
      review.dislikes.pull(userId);
    } else {
      review.dislikes.push(userId);
      review.likes.pull(userId);
    }

    await review.save();
    res.status(200).json({ message: 'Dislike updated.', likes: review.likes.length, dislikes: review.dislikes.length });
  } catch (error) {
    console.error('Dislike Error:', error);
    res.status(500).json({ message: 'Server error while disliking review.' });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. User not found.' });
    }
    const userIdObj = new mongoose.Types.ObjectId(userId);
    const { reviewId } = req.params;

    const review = await ManagerReview.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    console.log('userId:', userId.toString());
    console.log('review.userId:', review.userId.toString());


    if (!review.userId.equals(userId)) {
      return res.status(403).json({ message: 'You are not authorized to delete this review.' });
    }

    await Manager.findByIdAndUpdate(review.managerId, {
      $pull: { reviews: reviewId },
    });

    await ManagerReview.findByIdAndDelete(reviewId);

    const manager = await Manager.findById(review.managerId);
    const allReviews = await ManagerReview.find({ managerId: review.managerId });
    const avgRating = allReviews.length
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;
    manager.averageRating = avgRating;
    await manager.save();

    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (error) {
    console.error('Delete Review Error:', error);
    res.status(500).json({ message: 'Server error while deleting review.' });
    console.log('userId:', userId);
    console.log('review.userId:', review.userId);

  }
};
// At top or bottom of managerReviewController.js

export const updateAverageRating = async (managerId) => {
  const reviews = await ManagerReview.find({ managerId });
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  await Manager.findByIdAndUpdate(managerId, { averageRating: avgRating });
};
