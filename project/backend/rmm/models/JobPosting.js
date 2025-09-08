import mongoose from 'mongoose';

const jobPostingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  jobTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobType', required: true },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  salaryRange: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'INR' }
  },
  experienceLevelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExperienceLevel',
    required: true
  },  
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Host', required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('JobPosting', jobPostingSchema);