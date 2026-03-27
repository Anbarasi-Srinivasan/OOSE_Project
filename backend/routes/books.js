const express = require('express');
const router = express.Router();
const { createBook, getBooks, getBookById, updateBook, deleteBook, uploadFiles, downloadBookPdf } = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getBooks);
router.get('/:id', getBookById);
router.get('/:id/download', downloadBookPdf);

// Admin Only Routes
router.post('/', protect, authorize('admin'), uploadFiles, createBook);
router.put('/:id', protect, authorize('admin'), updateBook);
router.delete('/:id', protect, authorize('admin'), deleteBook);

module.exports = router;
