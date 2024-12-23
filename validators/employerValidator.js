const { check, validationResult } = require('express-validator');

const validateEmployer = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('name', 'Company name is required').not().isEmpty(),
  check('location', 'Location is required').not().isEmpty(),
  check('industry', 'Industry is required').not().isEmpty(),
  check('vision', 'Vision is required').not().isEmpty(),
  check('mission', 'Mission is required').not().isEmpty(),
  check('ourValues', 'Our values are required').isArray(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
module.exports = { validateEmployer };