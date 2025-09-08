// controllers/jobTypeController.ts
import JobType from '../models/JobType.js';

export const createJobType = async (req, res) => {
  const { name } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  const existing = await JobType.findOne({ slug });
  if (existing) return res.status(409).json({ message: 'Job type already exists' });

  const jobType = await JobType.create({ name, slug });
  res.status(201).json(jobType);
};

export const getAllJobTypes = async (req, res) => {
  const jobTypes = await JobType.find().sort({ name: 1 });
  res.json(jobTypes);
};