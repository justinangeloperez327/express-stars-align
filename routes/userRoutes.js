const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const employee = require('../middleware/employee');
const employer = require('../middleware/employer');

router.get('/profile', auth, userController.getProfile);
router.get('/employer-profile', auth, employer, userController.getEmployerProfile);
router.put('/profile', auth, employee, userController.updateEmployeeProfile);
router.put('/employer-profile', auth, employer, userController.updateEmployerProfile);

module.exports = router;