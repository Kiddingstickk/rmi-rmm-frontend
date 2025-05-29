import express from 'express';
import { searchRmm } from '../controllers/searchRmmController.js'; // adjust path if needed

const router = express.Router();

router.get('/', searchRmm);

export default router;
