const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

// Restrict all admin dashboard endpoints to logged-in administrators
router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats', adminController.getDashboardStats);

module.exports = router;
