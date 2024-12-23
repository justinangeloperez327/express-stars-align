const { check, validationResult } = require('express-validator');

const validateLogin = [
  check('email').isEmail().withMessage('Please enter a valid email address'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateRegister = [
  check('email').isEmail().withMessage('Please enter a valid email address'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  // check('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateLogin, validateRegister };