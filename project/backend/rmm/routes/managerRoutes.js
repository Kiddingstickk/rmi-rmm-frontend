import express from 'express';
import { getAllManagers, getManagerById, createManager , updateManager, deleteManager } from '../controllers/managerController.js';
import auth from '../../shared/middleware/auth.js';
import Manager from '../models/Manager.js'; 


const router = express.Router();


router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { searchMode } = req.query;

    const regex = new RegExp(query, 'i'); 
    const filter = searchMode === 'company'
      ? { branch: regex }
      : { name: regex };

    const managers = await Manager.find(filter).limit(10);
    res.status(200).json(managers);
  } catch (err) {
    console.error('Error searching managers:', err);
    res.status(500).json({ error: 'Server error while searching managers' });
  }
});




router.get('/', getAllManagers);
router.get('/:id', getManagerById);
router.post('/', createManager); 
router.put('/:id', updateManager);     
router.delete('/:id', deleteManager);  






export default router;
