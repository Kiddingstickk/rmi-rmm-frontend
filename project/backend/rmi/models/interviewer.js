import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  review: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
    // New fields for like/dislike
  likes: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
  dislikes: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] }
});

const interviewerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  position: { type: String },

  // New optional fields
  linkedin: { type: String },           // LinkedIn profile URL
  email: { type: String, lowercase: true }, // Contact email
  tags: [{ type: String }],             // e.g., ["DSA","Behavioral"]

  ratings: [ratingSchema],              // Embed ratings with user info
  rating: { type: Number, default: 0 }, // Average rating
  customAnswers: { type: [String], default: [] }, // Plain-text custom answers
});

const Interviewer = mongoose.model('Interviewer', interviewerSchema);

export default Interviewer;

