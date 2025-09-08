import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting', required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeUrl: { type: String }, // optional if you're storing resumes externally
  coverLetter: { type: String },
  status: { type: String, enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'], default: 'Pending' },
  appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('JobApplication', jobApplicationSchema);
