import JobPosting from '../models/JobPosting.js';

export const createJobPosting = async (req, res) => {
  const {
    title,
    description,
    companyId,
    branchId,
    jobTypeId,
    experienceLevelId,
    skills,
    salaryRange,
    postedBy
  } = req.body;

  if (!title || !companyId || !branchId || !jobTypeId || !experienceLevelId || !postedBy) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const job = new JobPosting({
      title,
      description,
      companyId,
      branchId,
      jobTypeId,
      experienceLevelId,
      skills,
      salaryRange,
      postedBy
    });

    await job.save();

    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    console.error('Error creating job posting:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};