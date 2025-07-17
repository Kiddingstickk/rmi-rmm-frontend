import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  city: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: '' // Optional — e.g. "Saket Nagar", "Sector 21"
  },
  managers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manager'
    }
  ]
}, { timestamps: true });

const Branch = mongoose.model('Branch', branchSchema);
export default Branch;