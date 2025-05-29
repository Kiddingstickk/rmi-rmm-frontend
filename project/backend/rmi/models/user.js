// /models/user.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  skipHashing: { type: Boolean, select: false },

  // From RMI
  savedInterviewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interviewer' }],
  savedManagers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Manager' }]
});

// Password hashing
userSchema.pre('save', async function (next) {
  if (this.skipHashing) return next();
  if (!this.isModified('password') || this.password.startsWith('$2b$')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
