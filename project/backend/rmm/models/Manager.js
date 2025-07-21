import mongoose from 'mongoose';

const flagSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});


const managerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: false
  },
  position: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    trim: true
  },
  averageRating: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ManagerReview'
    }
  ],
  flags: [flagSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  branch: {
    type: String,
    required: false,
    trim: true,
    default: "Head Office" // Or use "Unknown" if you'd prefer ambiguity
  },

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: false // Optional if you want flexibility
  },
  
});

const Manager = mongoose.model('Manager', managerSchema);
export default Manager;
