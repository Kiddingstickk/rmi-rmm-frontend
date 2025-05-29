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
    required: true
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
  }
});

const Manager = mongoose.model('Manager', managerSchema);
export default Manager;
