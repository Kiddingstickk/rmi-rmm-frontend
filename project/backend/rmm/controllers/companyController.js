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