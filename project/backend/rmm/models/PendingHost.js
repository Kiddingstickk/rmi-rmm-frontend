// /models/pendingHost.js
import mongoose from 'mongoose';

const pendingHostSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  companyName: { type: String, required: true }, // optional: pre-fill company
  otp: { type: String, required: true },
  otpExpiry: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  skipHashing: { type: Boolean, select: false }
});

// Hash password before saving
pendingHostSchema.pre('save', async function (next) {
  if (this.skipHashing) return next();
  if (!this.isModified('password') || this.password.startsWith('$2b$')) return next();

  const bcrypt = await import('bcryptjs');
  this.password = await bcrypt.default.hash(this.password, 10);
  next();
});

const PendingHost = mongoose.model('PendingHost', pendingHostSchema);
export default PendingHost;