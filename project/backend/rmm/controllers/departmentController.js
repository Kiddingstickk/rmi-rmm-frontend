// controllers/departmentController.js
import Department from '../models/Department.js';

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createDepartment = async (req, res) => {
    const { name } = req.body;
  
    if (!name) {
      return res.status(400).json({ message: 'Department name is required' });
    }
  
    try {
      const existing = await Department.findOne({ name });
      if (existing) {
        return res.status(400).json({ message: 'Department already exists' });
      }
  
      const department = new Department({ name });
      await department.save();
  
      res.status(201).json(department);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  };