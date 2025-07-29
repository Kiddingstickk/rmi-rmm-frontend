import Department from '../models/Department.js';
import Manager from '../models/Manager.js';

export const searchRmm = async (req, res) => {
  const query = req.query.q;

  try {
    // 🔧 Define the regex before using it
    const searchRegex = new RegExp(query, "i");

    const departmentResults = await Department.find({
      name: { $regex: searchRegex },
    });

    const managerResults = await Manager.find({
      name: { $regex: searchRegex },
    }).populate("department", "name")
    .populate("company", "name"); // ✅ populate department name

    res.json({
      departments: departmentResults,
      managers: managerResults,
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Search failed' });
  }
};
