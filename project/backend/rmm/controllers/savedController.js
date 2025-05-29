import User from '../../rmi/models/user.js';

export const saveManager = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.savedManagers.includes(req.params.managerId)) {
      user.savedManagers.push(req.params.managerId);
      await user.save();
    }
    res.json(user.savedManagers);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const unsaveManager = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedManagers = user.savedManagers.filter(id => id.toString() !== req.params.managerId);
    await user.save();
    res.json(user.savedManagers);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getSavedManagers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedManagers');
    res.json(user.savedManagers);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
