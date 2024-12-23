const express = require('express');
const router = express.Router();

const applicationController = require('../controllers/applicationController');
const employer = require('../middleware/employer');
const auth = require('../middleware/auth');
const employee = require('../middleware/employee');
const upload = require('../middleware/upload');

router.get('/', auth, applicationController.getAllApplications);
router.post('/', upload.single('resume'), auth, employee, applicationController.createApplication);
router.get('/:id', auth, applicationController.getApplication);
router.put('/:id', auth, applicationController.updateApplication);
router.delete('/:id', auth, applicationController.deleteApplication);

module.exports = router;