const express = require('express');
const router = express.Router();

const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');
const employer = require('../middleware/employer');
const employee = require('../middleware/employee');

router.get('/', jobController.getAllJobs);
router.get('/employer-jobs', auth, employer, jobController.getEmployerJobs);
router.get('/applied-jobs', auth, jobController.getAppliedJobs);
router.get('/:id', jobController.getJob);
router.get('/:id/details', auth, jobController.getJobDetails);
router.post('/', auth, employer, jobController.createJob);
router.put('/:id', auth, employer, jobController.updateJob);
router.delete('/:id', auth, employer, jobController.deleteJob);
router.get('/:id/applications', auth, employer, jobController.getJobApplications);

module.exports = router;