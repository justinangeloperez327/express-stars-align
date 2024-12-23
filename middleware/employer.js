const Company = require("../models/company");

const employer = async (req, res, next) => {
  try {
    const role = req.role;
    if (role !== 'employer') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const company = await Company.findOne({ user: req.userId });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    req.companyId = company._id;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = employer;