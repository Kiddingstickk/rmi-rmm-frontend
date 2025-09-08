import JobApplication from '../models/JobApplication.js';

export const submitApplication = async (req, res) => {
  const { jobId, applicantId, resumeUrl, coverLetter } = req.body;

  if (!jobId || !applicantId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const existing = await JobApplication.findOne({ jobId, applicantId });
    if (existing) {
      return res.status(409).json({ message: 'You’ve already applied to this job.' });
    }

    const application = await JobApplication.create({
      jobId,
      applicantId,
      resumeUrl,
      coverLetter
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
