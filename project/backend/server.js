// server.js (ESM syntax)
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import interviewersRoutes from './rmi/routes/interviewers.js';
import rmiAuthRoutes from './rmi/routes/auth.js';
import userRoutes from './rmi/routes/userRoutes.js';
import rmiReviewRoutes from './rmi/routes/reviewRoutes.js';
import contactRoutes from './rmi/routes/contactRoutes.js';
import replyRoutes from './rmi/routes/replyRoutes.js';

import rmmAuthRoutes from './rmm/routes/authRoutes.js';
import managerRoutes from './rmm/routes/managerRoutes.js';
//import rmmReviewRoutes from './rmm/routes/reviewRoutes.js';
import rmmSavedRoutes from './rmm/routes/savedRoutes.js';
import departmentRoutes from './rmm/routes/departmentRoutes.js';
import searchRoutes from './rmm/routes/searchRoutes.js';
import managerReviewRoutes from './rmm/routes/managerReviewRoutes.js';
import connectDB from './shared/config/db.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = ['https://rmi-rmm.netlify.app'];
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman) or from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies and authorization headers
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 

app.use(express.json());

// Routes for RMI
app.use('/api/interviewers', interviewersRoutes);
app.use('/api/auth/rmi', rmiAuthRoutes);
app.use('/api/user', userRoutes);  
app.use('/api/reviews/rmi', rmiReviewRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/replies', replyRoutes);

// Routes for RMM
app.use('/api/auth/rmm', rmmAuthRoutes);
app.use('/api/rmm/managers', managerRoutes);
//app.use('/api/reviews/rmm', rmmReviewRoutes);
app.use('/api/rmm/save', rmmSavedRoutes );
app.use('/api/departments', departmentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/manager-reviews', managerReviewRoutes);
// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch(err => console.error('❌ MongoDB connection error:', err));
