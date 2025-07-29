import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  
  managers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manager'
    }
  ]

}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);
export default Company;