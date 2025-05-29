import express from 'express';
import { getAllManagers, getManagerById, createManager , updateManager, deleteManager } from '../controllers/managerController.js';
import auth from '../../shared/middleware/auth.js';

const router = express.Router();

router.get('/', getAllManagers);
router.get('/:id', getManagerById);
router.post('/', createManager); 
router.put('/:id', updateManager);     
router.delete('/:id', deleteManager);  


export default router;
