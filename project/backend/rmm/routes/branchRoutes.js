import express from 'express';
import { getAllBranches, createBranch } from '../controllers/branchController.js';

const router = express.Router();

// GET /api/branches?search=...
router.get('/', getAllBranches);

// POST /api/branches
router.post('/', createBranch);

export default router;