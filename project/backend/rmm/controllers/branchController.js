// controllers/branchController.js
import Branch from '../models/Branch.js';

export const createBranch = async (req, res) => {
  const { name, city, companyId, location = '' } = req.body;

  if (!name || !city || !companyId) {
    return res.status(400).json({ message: 'Name, city, and company ID are required' });
  }

  try {
    // Check if branch with same name, city, and company already exists
    const existing = await Branch.findOne({
      name: new RegExp(`^${name}$`, 'i'),
      city: new RegExp(`^${city}$`, 'i'),
      company: companyId,
      location: new RegExp(`^${location}$`, 'i')
    });

    if (existing) {
      return res.status(400).json({ message: 'Branch already exists' });
    }

    const branch = new Branch({
      name: name.trim(),
      company: companyId,
      city: city.trim(),
      location: location.trim()
    });

    await branch.save();
    res.status(201).json(branch);
  } catch (err) {
    console.error('Error creating branch:', err);
    res.status(500).json({ error: 'Server error' });
  }
};