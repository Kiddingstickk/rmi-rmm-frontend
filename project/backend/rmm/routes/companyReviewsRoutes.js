import express from 'express';
import auth from '../../shared/middleware/auth.js';
import {
  submitCompanyReview,
  getCompanyReviews,
  getCompanyRatingSummary,
  getCompanyReviewsByMonth
} from '../controllers/companyReviewController.js';

const router = express.Router();

router.post('/submit', auth, submitCompanyReview);
router.get('/:companyId', getCompanyReviews);
router.get('/summary/:companyId', getCompanyRatingSummary);
router.get('/:companyId/monthly', getCompanyReviewsByMonth);

export default router;