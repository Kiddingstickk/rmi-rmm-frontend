import express from 'express';
import auth from '../../shared/middleware/auth.js';
import Reply from '../models/Reply.js';


const router = express.Router();

// POST: Add a reply
router.post('/', auth , async (req, res) => {
  try {
    console.log('REQ.BODY:', req.body);
    console.log('REQ.USER:', req.user);

    const { reviewId, text } = req.body;
    const userId = req.user.id;

    if (!text || !reviewId) {
      return res.status(400).json({ message: 'Reply text and review ID required' });
    }

    const reply = new Reply({ reviewId, userId, text });
    await reply.save();

    res.status(201).json({ message: 'Reply added', reply });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET: Get replies for a review
router.get('/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const replies = await Reply.find({ reviewId }).populate('userId', 'name');

    res.status(200).json(replies);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// PUT - Update existing interviewer review
router.put('/:id', auth, async (req, res) => {
  try {
    const { rating, reviewText, interviewStatus, anonymous } = req.body;

    const updated = await Review.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // ensures ownership
      { rating, reviewText, interviewStatus, anonymous },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Review not found or unauthorized.' });
    }

    res.json({ message: 'Review updated', review: updated });
  } catch (err) {
    console.error('Update failed:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});


export default router;
