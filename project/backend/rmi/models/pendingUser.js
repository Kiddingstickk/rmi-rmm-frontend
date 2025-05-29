// /models/pendingUser.js
import mongoose from 'mongoose';
//import bcrypt from 'bcryptjs';

const pendingUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  otpExpiry: { type: Number, required: true },
});

//pendingUserSchema.pre('save', async function (next) {
  //if (!this.isModified('password')) return next();
  //this.password = await bcrypt.hash(this.password, 10);
  //next();
//});

const PendingUser = mongoose.models.PendingUser || mongoose.model('PendingUser', pendingUserSchema);
export default PendingUser;
