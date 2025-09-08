// controllers/experienceLevelController.ts
import ExperienceLevel from '../models/ExperienceLevel.js';

export const createExperienceLevel = async (req, res) => {
  const { name } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  const existing = await ExperienceLevel.findOne({ slug });
  if (existing) return res.status(409).json({ message: 'Experience level already exists' });

  const level = await ExperienceLevel.create({ name, slug });
  res.status(201).json(level);
};

export const getAllExperienceLevels = async (req, res) => {
  const levels = await ExperienceLevel.find().sort({ name: 1 });
  res.json(levels);
};