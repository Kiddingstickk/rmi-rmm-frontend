import express from 'express';
import { registerHost, verifyHostRegistration, hostLogin ,verifyHostOtp } from '../controllers/hostAuthController.js';

const router = express.Router();

router.post('/register', registerHost);
router.post('/verify', verifyHostRegistration);
router.post('/login', hostLogin);
router.post('/verify-otp', verifyHostOtp)

export default router;
