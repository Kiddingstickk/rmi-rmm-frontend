import express from 'express';
import { getAllCompanies, createCompany } from '../controllers/companyController.js';

const router = express.Router();

// GET /api/companies?search=...
router.get('/', getAllCompanies);

// POST /api/companies
router.post('/', createCompany);

export default router;