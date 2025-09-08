// models/State.ts
import mongoose from 'mongoose';

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, 
  abbreviation: { type: String, required: true, unique: true }, 
  slug: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model('State', stateSchema);