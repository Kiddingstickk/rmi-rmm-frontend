import State from '../models/State.js';

export const createState = async (req, res) => {
  const { name, abbreviation } = req.body;

  if (!name || !abbreviation) {
    return res.status(400).json({ message: 'Name and abbreviation are required' });
  }

  const slug = name.toLowerCase().replace(/\s+/g, '-');

  try {
    const existing = await State.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: 'State already exists' });
    }

    const state = new State({ name, abbreviation, slug });
    await state.save();

    res.status(201).json({ message: 'State created successfully', state });
  } catch (error) {
    console.error('Error creating state:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};