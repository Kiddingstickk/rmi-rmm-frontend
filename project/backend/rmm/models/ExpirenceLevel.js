import mongoose from 'mongoose';

const experienceLevelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, 
  slug: { type: String, required: true, unique: true }, 
  description: { type: String }
}, { timestamps: true });

export default mongoose.model('ExperienceLevel', experienceLevelSchema);