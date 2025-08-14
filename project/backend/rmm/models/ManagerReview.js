// backend/rmm/models/ManagerReview.js
import mongoose from 'mongoose';

const managerReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manager',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  leadership: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  communication: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  teamwork: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  empathy: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  fairness: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  reviewText: {
    type: String,
    trim: true
  },
  anonymous: {
    type: Boolean,
    default: false,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reviewLeadership: {
    type: String,
    trim: true
  },
  reviewCommunicationText: {
    type: String,
    trim: true
  },
  reviewSupport: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('ManagerReview', managerReviewSchema);
