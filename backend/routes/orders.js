const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getAdminAnalytics } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/admin/analytics', protect, authorize('admin'), getAdminAnalytics);

module.exports = router;
