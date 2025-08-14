// controllers/branchController.js
import Branch from '../models/Branch.js';



export const getAllBranches = async (req, res) => {
    const { search } = req.query;
  
    const filter = search
      ? {
          $or: [
            { name: new RegExp(search.trim(), 'i') },
            { city: new RegExp(search.trim(), 'i') },
            { location: new RegExp(search.trim(), 'i') }
          ]
        }
      : {};
  
    try {
      const branches = await Branch.find(filter)
        .populate('company', 'name') // includes company name
        .sort({ city: 1, name: 1 });
      res.json(branches);
    } catch (err) {
      console.error('Error fetching branches:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };





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


export const getBranches = async (req, res) => {
  const { search = '', companyId } = req.query;

  const filter = {
    ...(search.trim() && {
      $or: [
        { name: new RegExp(search.trim(), 'i') },
        { city: new RegExp(search.trim(), 'i') },
        { location: new RegExp(search.trim(), 'i') },
      ],
    }),
    ...(companyId && { company: companyId }),
  };

  try {
    const branches = await Branch.find(filter)
      .populate('company', 'name') // optional
      .sort({ city: 1, name: 1 });
    res.json(branches);
  } catch (err) {
    console.error('Error fetching branches:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
