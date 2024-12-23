const express = require('express');
const router = express.Router();

const employerController = require('../controllers/employerController');
const employer = require('../middleware/employer');

router.get('/', employerController.getAllEmployers);
router.get('/:id', employerController.getEmployer);
router.put('/:id', employerController.updateEmployer);
router.delete('/:id', employerController.deleteEmployer);
