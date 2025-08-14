import express from 'express';
import auth from '../../shared/middleware/auth.js';
import {
  submitCompanyReview,
  getCompanyReviews,
  getCompanyRatingSummary,
  getCompanyReviewsByMonth,
  checkCompanyReviewEligibility
} from '../controllers/companyReviewController.js';

const router = express.Router();

router.get('/check-eligibility/:companyId', auth, checkCompanyReviewEligibility);
router.post('/submit', auth, submitCompanyReview);
router.get('/:companyId', getCompanyReviews);
router.get('/summary/:companyId', getCompanyRatingSummary);
router.get('/:companyId/monthly', getCompanyReviewsByMonth);

export default router;