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

    let managers;

    if (searchMode === 'company') {
      // First, find matching companies
      const Company = (await import('../models/Company.js')).default;
      const matchingCompanies = await Company.find({ name: regex }).select('_id');

      if (matchingCompanies.length === 0) {
        return res.status(200).json([]); // No matching companies
      }

      managers = await Manager.find({ company: { $in: matchingCompanies.map(c => c._id) } })
        .populate('company', 'name')
        .limit(10)
        .lean();
    } else {
      // Search by manager name
      managers = await Manager.find({ name: regex })
        .populate('company', 'name')
        .limit(10)
        .lean();
    }

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
