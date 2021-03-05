const router = require('express').Router();
const adminController = require('../controller/admin_controller');

router.get('/dashboard', adminController.viewDashboard);

module.exports = router;