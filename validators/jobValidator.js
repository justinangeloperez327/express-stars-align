const { check, validationResult } = require('express-validator');

const validateJob = [
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('responsibilities', 'Responsibilities are required').isArray(),
  check('qualifications', 'Qualifications are required').isArray(),
  check('location', 'Location is required').not().isEmpty(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateJob;