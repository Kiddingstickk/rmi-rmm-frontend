import PendingHost from '../models/PendingHost.js';
import Host from '../models/Host.js';
import Company from '../models/Company.js';
import sendEmail from '../../utils/sendEmail.js';
import bcrypt from 'bcryptjs';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const registerHost = async (req, res) => {
  const { email, password, companyName } = req.body;

  const existingHost = await Host.findOne({ email });
  if (existingHost) return res.status(400).json({ message: 'Host already exists' });

  const otp = generateOTP();
  const otpExpiry = Date.now() + 10 * 60 * 1000;
  const hashedPassword = await bcrypt.hash(password, 10);

  const pendingHost = new PendingHost({ email, password: hashedPassword, companyName, otp, otpExpiry });
  await pendingHost.save();

  await sendEmail(
    email,
    'Your OTP for Host Registration',
    `Hello,\n\nYour OTP for registering as a company host is: ${otp}\nIt will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.\n\n— Rate My Management`
  );  
  res.json({ message: 'OTP sent. Verify to complete registration.' });
};

export const verifyHostRegistration = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const pendingHost = await PendingHost.findOne({ email });
    if (!pendingHost) {
      return res.status(400).json({ message: 'No pending registration found for this email.' });
    }

    if (pendingHost.otp !== otp || Date.now() > pendingHost.otpExpiry) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Please try again.' });
    }
  // Create company if needed
  let company = await Company.findOne({ name: pendingHost.companyName });
  if (!company) {
    company = new Company({ name: pendingHost.companyName });
    await company.save();
  }

  const host = new Host({
    email: pendingHost.email,
    passwordHash: pendingHost.password,
    company: company._id
  });

  await host.save();
  await PendingHost.deleteOne({ email });
  await sendEmail(
    host.email,
    'Registration Successful',
    `Your host account has been successfully verified and linked to ${company.name}. You can now log in and manage your company dashboard.`
  );

  res.status(200).json({ message: 'Host verified and registered successfully.', host });
} catch (error) {
  console.error('Error verifying host OTP:', error);
  res.status(500).json({ message: 'Verification failed. Please try again later.' });
}
};


export const hostLogin = async (req, res) => {
  const { email, password } = req.body;

  const host = await Host.findOne({ email });
  if (!host) return res.status(404).json({ message: 'Host not found' });

  const isMatch = await bcrypt.compare(password, host.passwordHash);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const otp = generateOTP(); 
  host.otp = otp;
  host.otpExpires = Date.now() + 5 * 60 * 1000; 
  await host.save();

  await sendEmail(
    email,
    'Your OTP for Host Login',
    `Hello,\n\nYour OTP for logging in as a company host is: ${otp}\nIt will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.\n\n— Rate My Management`
  );
  
  res.json({ message: 'OTP sent. Verify to complete login.', hostId: host._id });
};

export const verifyHostOtp = async (req, res) => {
  const { hostId, otp } = req.body;

  const host = await Host.findById(hostId);
  if (!host || host.otp !== otp || Date.now() > host.otpExpires) {
    return res.status(401).json({ message: 'Invalid or expired OTP' });
  }

  host.lastLogin = new Date();
  host.otp = null;
  host.otpExpires = null;
  await host.save();

  const token = jwt.sign({ hostId: host._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.json({ message: 'Login successful', token });
};


