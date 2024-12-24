const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');
const employee = require('../middleware/employee');

router.get('', auth, profileController.getProfile);
router.put('', auth, employee, profileController.updateProfile);

router.get('/education', auth, employee, profileController.getEducation);
router.post('/education', auth, employee, profileController.addEducation);
router.put('/education/:educationId', auth, employee, profileController.updateEducation);
router.delete('/education/:educationId', auth, employee, profileController.deleteEducation);

router.get('/experience', auth, employee, profileController.getExperience);
router.post('/experience', auth, employee, profileController.addExperience);
router.put('/experience/:experienceId', auth, employee, profileController.updateExperience);
router.delete('/experience/:experienceId', auth, employee, profileController.deleteExperience);

module.exports = router;