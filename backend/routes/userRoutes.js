const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    getSavedBooks, 
    toggleSaveBook, 
    getNotifications, 
    markNotificationsRead 
} = require('../controllers/userController');

router.get('/library', protect, getSavedBooks);
router.post('/library/toggle', protect, toggleSaveBook);
router.get('/notifications', protect, getNotifications);
router.post('/notifications/read', protect, markNotificationsRead);

module.exports = router;
