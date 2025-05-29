import express from 'express';
import auth from '../../shared/middleware/auth.js';
import Interviewer from '../models/interviewer.js';
import User from '../models/user.js';



const router = express.Router();

// GET /api/user/my-reviews
router.get('/my-reviews', auth , async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    const interviewers = await Interviewer.find({ 'ratings.userId': userId });

    const reviews = interviewers.flatMap(interviewer =>
      interviewer.ratings
        .filter(r => r.userId.toString() === userId.toString())
        .map(r => ({
          interviewerId: interviewer._id,
          interviewerName: interviewer.name,
          company: interviewer.company,
          rating: r.rating,
          review: r.review,
          date: r.date
        }))
    );

    return res.json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// --- FIX: NOW, OUTSIDE ---

// GET /api/user/profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id || user.userId;

    // Count number of reviews
    const interviewers = await Interviewer.find({ 'ratings.userId': userId });
    const totalReviews = interviewers.reduce((count, interviewer) => {
      return count + interviewer.ratings.filter(r => r.userId.toString() === userId.toString()).length;
    }, 0);

    // Calculate tokens (say 10 tokens per review for example)
    const tokens = totalReviews * 10;

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,  // Make sure your User model has this
      totalReviews,
      tokens
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/toggle-save/:interviewerId', auth , async (req, res) => {
  try {
    const userId = req.user.id;
    const interviewerId = req.params.interviewerId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const alreadySaved = user.savedInterviewers.includes(interviewerId);

    if (alreadySaved) {
      user.savedInterviewers = user.savedInterviewers.filter(id => id.toString() !== interviewerId);
      await user.save();
      return res.json({ message: 'Interviewer unsaved' });
    } else {
      user.savedInterviewers.push(interviewerId);
      await user.save();
      return res.json({ message: 'Interviewer saved' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});




// GET /api/user/saved
router.get('/saved', auth , async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedInterviewers');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ savedInterviewers: user.savedInterviewers });

  } catch (error) {
    console.error('Error fetching saved interviewers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});





export default router;
