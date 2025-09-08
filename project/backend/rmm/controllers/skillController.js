// controllers/skillController.ts
import Skill from '../models/Skill.js';

export const createSkill = async (req, res) => {
  const { name } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  const existing = await Skill.findOne({ slug });
  if (existing) return res.status(409).json({ message: 'Skill already exists' });

  const skill = await Skill.create({ name, slug });
  res.status(201).json(skill);
};

export const getAllSkills = async (req, res) => {
  const skills = await Skill.find().sort({ name: 1 });
  res.json(skills);
};