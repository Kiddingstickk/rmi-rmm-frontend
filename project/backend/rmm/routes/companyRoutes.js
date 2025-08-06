import express from 'express';
import { getAllCompanies, createCompany ,getCompanyById } from '../controllers/companyController.js';

const router = express.Router();


router.get('/', getAllCompanies);


router.post('/', createCompany);

router.get('/search/company/:name/:id', getCompanyById);
export default router;