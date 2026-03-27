const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All order routes require authentication

router.post('/', createOrder);
router.get('/my-library', getUserOrders);

module.exports = router;
