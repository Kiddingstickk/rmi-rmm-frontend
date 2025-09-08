import express from 'express';
import { createJobPosting } from '../controllers/jobController.js';

const router = express.Router();

// POST /api/jobs/create
router.post('/create', createJobPosting);

export default router;