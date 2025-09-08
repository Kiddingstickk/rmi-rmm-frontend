// /models/host.js
import mongoose from 'mongoose';

const hostSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  verified: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null }
}, { timestamps: true });

const Host = mongoose.model('Host', hostSchema);
export default Host;