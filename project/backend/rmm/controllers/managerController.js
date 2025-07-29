import Manager from '../models/Manager.js';
import Department from '../models/Department.js';
import Company from '../models/Company.js';


// Get all managers

export const getAllManagers = async (req, res) => {
  console.log('🚀 [getAllManagers] Controller triggered');

  try {
    const { q } = req.query;

    let query = {};
    if (q && q.trim() !== '') {
      const regex = new RegExp(q.trim(), 'i');
      query.name = { $regex: regex };
    }
    console.log('🔍 Query:', query);

    const managers = await Manager.find(query)
      .populate({
        path: 'company',
        select: 'name',
        options: { strictPopulate: false } // ✅ prevents errors if company is missing
      })
      .populate('department', 'name');
      console.log('📦 Raw managers after populate:', JSON.stringify(managers, null, 2));

    // Optional: Normalize response to ensure company is either object or undefined
    const normalized = managers.map(manager => ({
      ...manager,
      company: manager.company?.name
        ? { _id: manager.company._id, name: manager.company.name }
        : undefined
    }));
    console.log('✅ Normalized managers:', JSON.stringify(normalized, null, 2));

    res.json({ managers: normalized });
  } catch (err) {
    console.error('Error fetching managers:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a manager by ID
export const getManagerById = async (req, res) => {
  try {
    const manager = await Manager.findById(req.params.id)
    .populate('company', 'name')
    .populate('department', 'name')
    .populate({
      path: 'reviews',
      select: 'rating comment createdAt' // Only show safe fields
    });



    if (!manager) return res.status(404).json({ message: 'Manager not found' });
    res.json(manager);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};



// Update a manager by ID
export const updateManager = async (req, res) => {
  const { name, departmentId, position, bio } = req.body;

  try {
    const department = await Department.findById(departmentId);
    if (!department) return res.status(400).json({ message: 'Invalid department' });

    const updated = await Manager.findByIdAndUpdate(
      req.params.id,
      {
        name,
        department: department._id,
        position,
        bio
      },
      { new: true }
    ).populate('department');

    if (!updated) return res.status(404).json({ message: 'Manager not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


// Delete a manager by ID
export const deleteManager = async (req, res) => {
  try {
    const deleted = await Manager.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Manager not found' });

    res.json({ message: 'Manager deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};




// Create a new manager (admin-only)
export const createManager = async (req, res) => {
  const { name, departmentId, position, bio, branch, company } = req.body;

  try {
    let department = null;

    if (departmentId) {
      department = await Department.findById(departmentId);
      if (!department) return res.status(400).json({ message: 'Invalid department' });
    }

    const manager = new Manager({
      name,
      position,
      bio,
      branch,
      company,
      averageRating: 0,
      ...(department && { department: department._id }) 
    });

    await manager.save();

    if (department) {
      await Department.findByIdAndUpdate(departmentId, {
        $addToSet: { managers: manager._id }
      });
    }

    if (company) {
      await Company.findByIdAndUpdate(company, {
        $addToSet: { managers: manager._id }
      });
    }

    res.status(201).json(manager);
  } catch (err) {
    console.error('Error creating manager:', err);
    res.status(500).json({ error: 'Server error' });
  }
};