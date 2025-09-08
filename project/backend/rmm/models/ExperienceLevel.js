// models/ExperienceLevel.ts
import mongoose from 'mongoose';

const experienceLevelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String }, // optional for UI
  description: { type: String }, // optional
  verified: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('ExperienceLevel', experienceLevelSchema);