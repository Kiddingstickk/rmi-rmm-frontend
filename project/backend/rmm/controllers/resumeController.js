import Resume from '../models/Resume.js';

// Create Resume
export const createResume = async (req, res) => {
  try {
    const resume = new Resume({ ...req.body, userId: req.user._id });
    await resume.save();
    res.status(201).json(resume);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Resumes for User
export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Resume
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Resume
export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json(resume);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Resume
export const deleteResume = async (req, res) => {
  try {
    const result = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!result) return res.status(404).json({ error: 'Resume not found' });
    res.json({ message: 'Resume deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};