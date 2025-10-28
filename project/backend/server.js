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
import companyRoutes from './rmm/routes/companyRoutes.js';
import branchRoutes from './rmm/routes/branchRoutes.js';
import sitemapRoute from './rmm/routes/sitemap.js';
import companyReviewRoutes from './rmm/routes/companyReviewsRoutes.js'
import geocodeRoutes from './rmm/routes/geocodeRoutes.js';
import resumeRoutes from './rmm/routes/resumeRoutes.js';
import hostRoutes from './rmm/routes/hostRoutes.js' ;
import stateRoutes from './rmm/routes/stateRoutes.js';
import jobRoutes from './rmm/routes/jobRoutes.js';
import skillRoutes from './rmm/routes/skillRoutes.js';
import experienceLevelRoutes from './rmm/routes/experienceLevelRoutes.js';
import jobTypeRoutes from './rmm/routes/jobTypeRoutes.js';
import jobApplicationRoutes from './rmm/routes/jobApplicationRoutes.js';
import statusRoutes from './rmm/routes/statusRoute.js'







dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  'https://ratemymanagement.com',
   
];
const corsOptions = {
  origin: (origin, callback) => {
    console.log('🌐 Incoming request from:', origin); // Optional debug
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
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
app.use('/api/auth/', rmmAuthRoutes);
app.use('/api/managers', managerRoutes);
//app.use('/api/reviews/rmm', rmmReviewRoutes);
app.use('/api/save', rmmSavedRoutes );
app.use('/api/departments', departmentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/manager-reviews', managerReviewRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/branches', branchRoutes);
app.use('/', sitemapRoute);
app.use('/api/company-reviews', companyReviewRoutes);
app.use('/api/geocode', geocodeRoutes);
app.use('/api/resume',resumeRoutes);
app.use('/api/host', hostRoutes);
app.use('/api/state', stateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experience-levels', experienceLevelRoutes);
app.use('/api/job-types', jobTypeRoutes);
app.use('/api/job-application', jobApplicationRoutes);
app.use('/api', statusRoutes);




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
