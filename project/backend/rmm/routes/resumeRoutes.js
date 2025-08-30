import express from 'express';
import {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume
} from '../controllers/resumeController.js';
import auth from '../../shared/middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(auth, createResume)
  .get(auth, getResumes);

router.route('/:id')
  .get(auth, getResumeById)
  .put(auth, updateResume)
  .delete(auth, deleteResume);

export default router;