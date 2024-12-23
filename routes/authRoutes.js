const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { validateLogin, validateRegister } = require('../validators/authValidators');

router.post('/register', validateRegister, userController.registerEmployee);
router.post('/register-employer', validateRegister, userController.registerEmployer);
router.post('/login', validateLogin, userController.login);

module.exports = router;