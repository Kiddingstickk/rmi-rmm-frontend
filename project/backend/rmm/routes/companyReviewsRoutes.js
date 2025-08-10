import express from 'express';
import {
  submitCompanyReview,
  getCompanyReviews,
  getCompanyRatingSummary
} from '../controllers/companyReviewController.js';

const router = express.Router();

router.post('/submit', submitCompanyReview);
router.get('/:companyId', getCompanyReviews);
router.get('/summary/:companyId', getCompanyRatingSummary);

export default router;