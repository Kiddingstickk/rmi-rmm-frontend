import mongoose from 'mongoose';

const CompanyReviewSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ratings: {
    workLifeBalance: { type: Number, min: 1, max: 5, required: true },
    compensation: { type: Number, min: 1, max: 5, required: true },
    culture: { type: Number, min: 1, max: 5, required: true },
    careerGrowth: { type: Number, min: 1, max: 5, required: true },
    diversity: { type: Number, min: 1, max: 5, required: true }
  },
  reviews: {
    treatment: { type: String, maxlength: 2000 },
    careerGrowth: { type: String, maxlength: 2000 },
    diversity: { type: String, maxlength: 2000 },
    pros: { type: String, maxlength: 1000 },
    cons: { type: String, maxlength: 1000 },
    advice: { type: String, maxlength: 1000 }
  },
  isAnonymous: {
    type: Boolean,
    default: true
  },
  reviewPeriod: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


CompanyReviewSchema.index({ reviewerId: 1, company: 1, reviewPeriod: 1 }, { unique: true });


const CompanyReview = mongoose.model('CompanyReview', CompanyReviewSchema);
export default CompanyReview;