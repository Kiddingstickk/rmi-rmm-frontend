import express from 'express';
import auth from '../../shared/middleware/auth.js';
import Interviewer from '../models/interviewer.js';
import ManagerReview from '../../rmm/models/ManagerReview.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';



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
    // Fetch the authenticated user
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Count actual manager reviews submitted by this user
    const totalReviews = await ManagerReview.countDocuments({
      userId: user._id
    });

    // Existing token calculation: 10 tokens per review
    const tokens = totalReviews * 10;

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      totalReviews,
      tokens
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});


// PATCH /api/user/profile
router.patch('/profile', auth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name.trim();
    await user.save();

    // Generate updated token with the new name
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Name updated successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});



// PATCH /api/user/change-password
router.patch('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: 'All password fields are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: 'New password must be at least 8 characters long'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'New passwords do not match'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    return res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ message: 'Server error' });
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
