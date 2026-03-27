const express = require('express');
const router = express.Router();
const { getDashboardStats, getSalesReports, getUsers, getAcademicProfile } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/reports', getSalesReports);
router.get('/users', getUsers);
router.get('/academic-profile', getAcademicProfile);

module.exports = router;
