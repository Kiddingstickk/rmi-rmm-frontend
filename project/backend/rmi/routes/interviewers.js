import express from 'express';
import Interviewer from '../models/interviewer.js';
import mongoose from 'mongoose';

import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../../shared/middleware/auth.js';
import Company from '../../rmm/models/Company.js';



const router = express.Router();

// GET all interviewers
router.get('/', async (req, res) => {
  try {
    const interviewers = await Interviewer.find();
    res.json(interviewers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET by name or company
router.get('/search/:query', async (req, res) => {
  const { query } = req.params;

  try {
    // 1. Find companies with interviewers matching name or position
    const companies = await Company.find()
    .populate({
      path: 'interviewers',
      match: {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { position: { $regex: query, $options: 'i' } }
        ]
      },
      select: 'name position rating ratings experience' // ✅ Include rating fields
    });

    // 2. Flatten and enrich interviewers with company context
    const matchedInterviewers = companies.flatMap((comp) =>
      comp.interviewers.map((i) => {
        const interviewerObj = i.toObject();
        return {
          ...interviewerObj,
          company: {
            _id: comp._id,
            name: comp.name
          },
          rating: interviewerObj.rating ?? 0,
          ratings: interviewerObj.ratings ?? []
        };
      })
    );

    res.json(matchedInterviewers);
  } catch (err) {
    console.error('Search failed:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT - Update interviewer
router.put('/:id', async (req, res) => {
  try {
    const updated = await Interviewer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - Remove interviewer
router.delete('/:id', async (req, res) => {
  try {
    const result = await Interviewer.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Interviewer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Route to get an interviewer by ID
router.get('/:id', async (req, res) => {
  try {
    const interviewer = await Interviewer.findById(req.params.id).populate('company');
    if (!interviewer) {
      return res.status(404).json({ message: 'Interviewer not found' });
    }
    res.json(interviewer);
  } catch (err) {
    console.error('Error fetching interviewer:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// routes/interviewers.js




function sigmoidAverage(ratings) {
  if (ratings.length === 0) return 0;
  const total = ratings.reduce((sum, r) => sum + r.rating, 0);
  const avg = total / ratings.length;
  return 5 / (1 + Math.exp(-avg + 2.5));  // simple sigmoid transformation
}

router.post('/:id/rating', auth , async (req, res) => {
  const { id } = req.params;
  const { rating, review } = req.body;
  console.log('Incoming rating request');
  console.log('Review text =', review);
  console.log('Decoded user from token:', req.user);


  try {
    const interviewer = await Interviewer.findById(id);
    if (!interviewer) {
      return res.status(404).json({ message: 'Interviewer not found' });
    }
    console.log('Decoded JWT user:', req.user);

    const userId = req.user.userId;
    console.log('userId from token:', userId);


    if (!userId) {
      return res.status(401).json({ message: 'User ID missing in token' });
    }

    // Check if user has already submitted a review
    const existingReview = interviewer.ratings.find(r => r.userId && r.userId.toString() === userId);
    

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.review = review;
      existingReview.date = new Date();
    } else {
      console.log('Pushing new rating with userId:', userId);

      interviewer.ratings.push({
        rating,
        review,
        userId : new mongoose.Types.ObjectId(userId),
        date: new Date(),
      });
    }

    // Recalculate average rating using sigmoid
    interviewer.rating = sigmoidAverage(interviewer.ratings);
    console.log('Ratings before save:', interviewer.ratings);
    console.log('About to save interviewer:', interviewer);
    

    await interviewer.save();

    res.status(200).json({ message: 'Review submitted', interviewer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// POST - Create a new interviewer
router.post('/', async (req, res) => {
  const { name, company, position, rating, experience } = req.body;

  if (!name || !company) {
    return res.status(400).json({ message: 'Name and company are required.' });
  }


  const newInterviewer = new Interviewer({
    name,
    company,
    position,
    rating,
    experience,
    reviews: []  // You can initialize the reviews as an empty array
  });

  try {
    const savedInterviewer = await newInterviewer.save();
    await Company.findByIdAndUpdate(company, {
      $addToSet: { interviewers: savedInterviewer._id }
    });


    res.status(201).json(savedInterviewer); // Return the saved interviewer
  } catch (err) {
    res.status(400).json({ message: 'Failed to create interviewer', error: err.message });
  }
});





// Get all users (protected route)
router.get('/users', auth , async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});



// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});



// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Generate JWT
    const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});



// Save custom answer to the database
router.post('/save-custom-answers', async (req, res) => {
  const { customAnswer, interviewerId } = req.body;

  try {
    // Find the interviewer by ID (or another identifier, depending on your setup)
    const interviewer = await Interviewer.findById(interviewerId);

    if (!interviewer) {
      return res.status(404).json({ message: "Interviewer not found" });
    }

    // Store the plain text custom answer in the database
    interviewer.customAnswer = customAnswer;
    await interviewer.save();

    res.status(200).json({ message: 'Custom answer saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving answer', error: err });
  }
});


// POST - Create a new interviewer (protected)
router.post('/', auth , async (req, res) => {
  const { name, company, position, linkedin, email, tags } = req.body;

  // Validate required fields
  if (!name || !company) {
    return res.status(400).json({ message: 'Name and company are required.' });
  }

  try {
    const newInterviewer = new Interviewer({
      name,
      company,
      position,
      linkedin,
      email,
      tags: Array.isArray(tags) ? tags : [],
      // ratings, rating and customAnswers will use schema defaults
    });

    const savedInterviewer = await newInterviewer.save();
    if (company) {
      await Company.findByIdAndUpdate(company, {
        $addToSet: { interviewers: savedInterviewer._id }
      });
    }


    res.status(201).json(savedInterviewer);
  } catch (err) {
    console.error('Error creating interviewer:', err);
    res.status(500).json({ message: 'Failed to create interviewer', error: err.message });
  }
});

router.post("/:interviewerId/reviews/:reviewId/like", auth, async (req, res) => {
  const { interviewerId, reviewId } = req.params;
  const userId = req.user.id;

  const interviewer = await Interviewer.findById(interviewerId);
  if (!interviewer) return res.status(404).json({ message: "Interviewer not found" });

  const review = interviewer.ratings.id(reviewId);
  if (!review) return res.status(404).json({ message: "Review not found" });

  // Prevent double likes
  if (!review.likes.includes(userId)) {
    review.likes.push(userId);
    review.dislikes.pull(userId); // remove dislike if present
  } else {
    review.likes.pull(userId); // toggle off
  }

  await interviewer.save();
  res.json({ likes: review.likes.length, dislikes: review.dislikes.length });
});


router.post("/:interviewerId/reviews/:reviewId/dislike", auth, async (req, res) => {
  const { interviewerId, reviewId } = req.params;
  const userId = req.user.id;

  const interviewer = await Interviewer.findById(interviewerId);
  if (!interviewer) return res.status(404).json({ message: "Interviewer not found" });

  const review = interviewer.ratings.id(reviewId);
  if (!review) return res.status(404).json({ message: "Review not found" });

  if (!review.dislikes.includes(userId)) {
    review.dislikes.push(userId);
    review.likes.pull(userId); // remove like if present
  } else {
    review.dislikes.pull(userId); // toggle off
  }

  await interviewer.save();
  res.json({ likes: review.likes.length, dislikes: review.dislikes.length });
});



export default router;
