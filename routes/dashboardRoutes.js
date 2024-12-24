const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const employer = require('../middleware/employer');

router.get('', auth, employer, dashboardController.getDashboardData);

module.exports = router;