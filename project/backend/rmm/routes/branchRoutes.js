import express from 'express';
import { getAllBranches, createBranch , getBranches , updateBranchLocations } from '../controllers/branchController.js';

const router = express.Router();

router.get('/', getBranches);

// GET /api/branches?search=...
//router.get('/', getAllBranches);

// POST /api/branches
router.post('/', createBranch);
router.patch('/:id', updateBranchLocations);


export default router;