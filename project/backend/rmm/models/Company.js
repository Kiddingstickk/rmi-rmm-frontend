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
,
  companyReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CompanyReview'
    }
  ],
  branches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch'
    }
  ]
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);
export default Company;