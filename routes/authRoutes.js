const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.post('/register', userController.registerEmployee);
router.post('/register-employer', userController.registerEmployer);
router.post('/login', userController.login);

module.exports = router;