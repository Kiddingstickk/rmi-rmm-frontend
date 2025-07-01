// controllers/departmentController.js
import Department from '../models/Department.js';



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



  export const getAllDepartments = async (req, res) => {
    try {
      const { search } = req.query;
  
      const filter = search
        ? { name: new RegExp(search.trim(), 'i') } // case-insensitive match
        : {};
  
      const departments = await Department.find(filter).sort({ name: 1 });
      res.json(departments);
    } catch (err) {
      console.error('Error fetching departments:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  