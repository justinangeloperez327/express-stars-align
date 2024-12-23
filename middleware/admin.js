
const admin = (req, res, next) => {
  try {
    const role = req.role;
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = admin;