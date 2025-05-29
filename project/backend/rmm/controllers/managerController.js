import Manager from '../models/Manager.js';
import Department from '../models/Department.js';

// Get all managers
export const getAllManagers = async (req, res) => {
  try {
    const managers = await Manager.find().populate('department');
    res.json(managers);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a manager by ID
export const getManagerById = async (req, res) => {
  try {
    const manager = await Manager.findById(req.params.id).populate('department');
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
  const { name, departmentId, position, bio } = req.body;

  try {
    const department = await Department.findById(departmentId);
    if (!department) return res.status(400).json({ message: 'Invalid department' });

    const manager = new Manager({
      name,
      department: department._id,
      position,
      bio
    });

    await manager.save();
    res.status(201).json(manager);
  } catch (err) {
    console.error('Error creating manager:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
