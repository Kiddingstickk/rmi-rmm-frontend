import express from 'express';
import { submitApplication } from '../controllers/jobApplicationController.js';

const router = express.Router();

router.post('/submit', submitApplication);

export default router;
