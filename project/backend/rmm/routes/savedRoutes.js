import express from 'express';
import {
  saveManager,
  unsaveManager,
  getSavedManagers,
} from '../controllers/savedController.js';
import authMiddleware from '../../shared/middleware/auth.js';

const router = express.Router();

router.post('/:managerId', authMiddleware, saveManager);
router.delete('/:managerId', authMiddleware, unsaveManager);
router.get('/', authMiddleware, getSavedManagers);

export default router;
