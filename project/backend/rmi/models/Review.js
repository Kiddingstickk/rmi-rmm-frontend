import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // Common
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Interviewer-specific
  interviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interviewer',
  },
  rating: {
    type: Number,
  },
  reviewText: {
    type: String,
  },
  interviewStatus: {
    type: String,
    enum: ['Cleared', 'Not Cleared', 'Waiting', 'No Interview'],
  },

  // Manager-specific
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manager',
  },
  ratings: {
    leadership: { type: Number },
    communication: { type: Number },
    supportiveness: { type: Number },
    transparency: { type: Number },
    overall: { type: Number },
  },
  comment: {
    type: String,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  anonymous: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['currently_working', 'former_employee', 'intern', 'other'],
  },

  // Shared
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Ensure mongoose does not recompile model on server restarts
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
