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
      const normalizedCity = city.trim().toLowerCase();
      const normalizedLocation = Array.isArray(location)
        ? location.map(loc => loc.trim())
        : [location.trim()];
  
      // Find branch by city only — global uniqueness
      let branch = await Branch.findOne({
        city: new RegExp(`^${normalizedCity}$`, 'i')
      });
  
      if (branch) {
        // Add companyId if not already present
        const alreadyLinked = branch.company.some(
          id => id.toString() === companyId.toString()
        );
  
        if (!alreadyLinked) {
          branch.company.push(companyId);
        }
  
        // Add new locations if needed
        const existingLocations = branch.location.map(loc => loc.toLowerCase());
        const newLocations = normalizedLocation.filter(
          loc => loc && !existingLocations.includes(loc.toLowerCase())
        );
  
        if (newLocations.length > 0) {
          branch.location.push(...newLocations);
        }
  
        await branch.save();
        return res.status(200).json(branch);
      }
  
      // No branch with this city exists — create new one
      const newBranch = new Branch({
        name: name.trim(),
        company: [companyId],
        city: normalizedCity,
        location: normalizedLocation
      });
  
      await newBranch.save();
      res.status(201).json(newBranch);
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
    ...(companyId && { company: { $in: [companyId] } }),
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



export const updateBranchLocations = async (req, res) => {
  const { location = [] } = req.body;
  const { id } = req.params;

  if (!Array.isArray(location)) {
    return res.status(400).json({ message: 'Location must be an array' });
  }

  try {
    const branch = await Branch.findById(id);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });

    const existing = branch.location.map(loc => loc.toLowerCase());
    const newLocations = location
      .map(loc => loc.trim())
      .filter(loc => loc && !existing.includes(loc.toLowerCase()));

    if (newLocations.length > 0) {
      branch.location.push(...newLocations);
      await branch.save();
    }

    res.json(branch);
  } catch (err) {
    console.error('Error updating branch locations:', err);
    res.status(500).json({ error: 'Server error' });
  }
};