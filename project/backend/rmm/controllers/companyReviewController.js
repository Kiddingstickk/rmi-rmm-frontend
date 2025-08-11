import CompanyReview from '../models/CompanyReview.js';
import Company from '../models/Company.js';

export const submitCompanyReview = async (req, res) => {
  try {
    const { companyId, ratings, reviews, isAnonymous = true } = req.body;
    const reviewerId = req.user.userId || req.user.id;

    const now = new Date();
    const reviewPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;


    const review = new CompanyReview({
      company: companyId,
      reviewerId,
      ratings,
      reviews,
      isAnonymous,
      reviewPeriod
    });

    await review.save();

    await Company.findByIdAndUpdate(companyId, {
      $push: { companyReviews: review._id }
    });

    res.status(201).json({ success: true, review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "You've already submitted a review for this company this month." });
    }
    console.error('Error submitting company review:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
};

export const getCompanyReviews = async (req, res) => {
    try { 
      const { companyId } = req.params; 
      const reviews = await CompanyReview.find({ company: companyId }).sort({ createdAt: -1 });
      res.json(reviews);
    } catch (err) {
      console.error('Error fetching company reviews:', err);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  };

  export const getCompanyRatingSummary = async (req, res) => {
    try {
      const { companyId } = req.params;
      const reviews = await CompanyReview.find({ company: companyId });
  
      if (reviews.length === 0) return res.json({ average: null });
  
      const totals = {
        facilities: 0,
        colleagues: 0,
        environment: 0,
        workLifeBalance: 0,
        salary: 0
      };
  
      reviews.forEach(r => {
        Object.keys(totals).forEach(key => {
          totals[key] += r.ratings[key];
        });
      });
  
      const averages = {};
      Object.keys(totals).forEach(key => {
        averages[key] = (totals[key] / reviews.length).toFixed(1);
      });
  
      res.json({ average: averages, count: reviews.length });
    } catch (err) {
      console.error('Error calculating company rating summary:', err);
      res.status(500).json({ error: 'Failed to calculate summary' });
    }
  };

  export const getCompanyReviewsByMonth = async (req, res) => {
    const { companyId } = req.params;
    const { month } = req.query; 
  
    try {
      const reviews = await CompanyReview.find({
        company: companyId,
        reviewPeriod: month
      });
  
      res.json(reviews);
    } catch (err) {
      console.error('Error fetching monthly reviews:', err);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  };



  export const getCompanyReviewsByOffset = async (req, res) => {
    const { companyId } = req.params;
    const { monthsAgo } = req.query; 
  
    try {
      const now = new Date();
      const target = new Date(now.getFullYear(), now.getMonth() - Number(monthsAgo), 1);
      const next = new Date(target.getFullYear(), target.getMonth() + 1, 1);
  
      const reviews = await CompanyReview.find({
        company: companyId,
        createdAt: { $gte: target, $lt: next }
      });
  
      res.json(reviews);
    } catch (err) {
      console.error('Error fetching offset reviews:', err);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  };