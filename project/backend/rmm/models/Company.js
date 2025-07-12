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
  interviewers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interviewer' // or 'Manager' — use whichever your schema links to
    }
  ]
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);
export default Company;