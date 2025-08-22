import express from 'express';
//import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import PendingUser from '../models/pendingUser.js';
import User from '../models/user.js';
import Interviewer from '../models/interviewer.js';
import auth from '../../shared/middleware/auth.js';
import sendEmail from '../../utils/sendEmail.js';
import verifyToken from '../../shared/middleware/auth.js';
const router = express.Router();

// ==================== REGISTER WITH OTP ====================
// REGISTER WITH OTP
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;


  try {
    // Check if the email already exists in PendingUser
    const existingUser = await PendingUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'This email is already in the process of registration. Please verify the OTP first.' });
    }

    // Generate OTP
    //const otp = crypto.randomBytes(3).toString('hex'); 

    //const otpExpiry = Date.now() + 10 * 60 * 1000;

    // Hash password
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new PendingUser instance
    const newPendingUser = new PendingUser({
      name,
      email,
      password,
      //otp,
      //otpExpiry,
      isVerified: false, // Not verified yet
    });

    // Save to PendingUser collection
    await newPendingUser.save();

    // Send OTP email
    //const subject = 'OTP Verification';
    //const text = `Your OTP for registration is: ${otp}. It will expire in 10 minutes.`;
    //await sendEmail(email, subject, text);

    // Respond with message to prompt OTP verification
    res.status(200).json({ message: 'Registration successful. Please verify your OTP.' });

  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ message: 'Registration failed. Please try again later.' });
  }
});




// VERIFY OTP Route
//router.post('/verify-otp', async (req, res) => {
  //const { email, otp } = req.body;

  //try {
    // Find the pending user by email
    //const pendingUser = await PendingUser.findOne({ email });
    //if (!pendingUser) {
      //return res.status(400).json({ message: 'No pending registration found for this email.' });
    //}

    // Check if the OTP has expired
    //if (pendingUser.otpExpiry < Date.now()) {
      //return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    //}

    // Check if the OTP matches
    //if (pendingUser.otp !== otp) {
      //return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    //}

    // OTP is valid, now create the user
    //const newUser = new User({
      //name: pendingUser.name,
      //email: pendingUser.email,
      //password: pendingUser.password, // Password already hashed
      //isVerified: true,
      //skipHashing: true,
    //});

    // Save the new user
    //await newUser.save();

    //newUser.skipHashing = true;

    // Delete the pending user from PendingUser collection
    //await PendingUser.deleteOne({ email });

    // Optionally, you can send a success email
    //const subject = 'Registration Successful';
    //const text = 'Your account has been successfully verified. You can now log in.';
    //await sendEmail(pendingUser.email, subject, text);

    // Respond with success message and guide to SignIn
    //res.status(200).json({ message: 'OTP verified successfully. You can now log in.' });

  //} catch (error) {
    //console.error('Error verifying OTP:', error);
    //res.status(500).json({ message: 'Verification failed. Please try again later.' });
  //}
//});



// ==================== LOGIN ====================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request:', email, password);

  try {
    const user = await User.findOne({ email });
    console.log('User found:', user);
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in' });
    }
    const isMatch = password === user.password;

    //const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// ==================== GET ALL USERS (Protected) ====================
router.get('/users', auth , async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// ==================== INTERVIEWER ROUTES BELOW ====================

// GET all interviewers
router.get('/interviewers', async (req, res) => {
  try {
    const interviewers = await Interviewer.find();
    res.json(interviewers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search by name or company
router.get('/interviewers/search/:query', async (req, res) => {
  const { query } = req.params;
  try {
    const results = await Interviewer.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get by ID
router.get('/interviewers/:id', async (req, res) => {
  try {
    const interviewer = await Interviewer.findById(req.params.id);
    if (!interviewer) return res.status(404).json({ message: 'Interviewer not found' });
    res.json(interviewer);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Create interviewer
router.post('/interviewers', async (req, res) => {
  const { name, company, position, rating, experience } = req.body;
  const newInterviewer = new Interviewer({
    name,
    company,
    position,
    rating,
    experience,
    reviews: [],
  });

  try {
    const savedInterviewer = await newInterviewer.save();
    res.status(201).json(savedInterviewer);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create interviewer', error: err.message });
  }
});

// Update interviewer
router.put('/interviewers/:id', async (req, res) => {
  try {
    const updated = await Interviewer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete interviewer
router.delete('/interviewers/:id', async (req, res) => {
  try {
    const result = await Interviewer.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Interviewer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sigmoid average helper
function sigmoidAverage(ratings) {
  if (ratings.length === 0) return 0;
  const total = ratings.reduce((sum, r) => sum + r.rating, 0);
  const avg = total / ratings.length;
  return 5 / (1 + Math.exp(-avg + 2.5));
}

// Submit or update rating
router.post('/interviewers/:id/rating', auth, async (req, res) => {
  const { id } = req.params;
  const { rating, review } = req.body;

  try {
    const interviewer = await Interviewer.findById(id);
    if (!interviewer) return res.status(404).json({ message: 'Interviewer not found' });

    const userId = req.user.id; // correct key based on auth.js
    console.log('Authenticated userId:', userId);
    const existingReview = interviewer.ratings.find(r => r.userId?.toString() === userId);
    

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.review = review;
      existingReview.date = new Date();
    } else {
      interviewer.ratings.push({ rating, review, userId, date: new Date() });
    }

    interviewer.rating = sigmoidAverage(interviewer.ratings);
    await interviewer.save();

    res.status(200).json({ message: 'Review submitted', interviewer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});





export default router;
