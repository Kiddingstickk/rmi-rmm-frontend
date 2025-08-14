import Company from '../models/Company.js';

// POST /api/companies
export const createCompany = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: 'Company name is required' });
  }

  try {
    const existing = await Company.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (existing) {
      return res.status(400).json({ message: 'Company already exists' });
    }

    const company = new Company({ name: name.trim() });
    await company.save();

    res.status(201).json(company);
  } catch (err) {
    console.error('Error creating company:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/companies?search=
export const getAllCompanies = async (req, res) => {
  try {
    const { search } = req.query;

    const filter = search
      ? { name: new RegExp(search.trim(), 'i') }  // Fuzzy match, case-insensitive
      : {};

    const companies = await Company.find(filter).sort({ name: 1 });
    res.json(companies);
  } catch (err) {
    console.error('Error fetching companies:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


// GET /api/search/company/:name/:id
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id).populate({
      path: 'managers',
      select: 'name position averageRating',
    })
    .populate('branches', 'name city location');

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const avgRating =
      company.managers.length > 0
        ? company.managers.reduce((sum, m) => sum + (m.averageRating || 0), 0) / company.managers.length
        : 0;

    res.json({
      company: {
        _id: company._id,
        name: company.name,
        description: company.description,
        avgRating: avgRating.toFixed(1),
      },
      managers: company.managers,
    });
  } catch (err) {
    console.error('Error fetching company by ID:', err);
    res.status(500).json({ error: 'Server error' });
  }
};