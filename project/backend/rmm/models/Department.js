import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: '',
  },
  managers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manager',
    }
  ]
}, { timestamps: true });

const Department = mongoose.model('Department', departmentSchema);
export default Department;
