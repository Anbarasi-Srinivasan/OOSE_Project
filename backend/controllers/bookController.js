const Book = require('../models/Book');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDFs and Images are permitted for Bookflix repositories!'));
        }
    }
}).fields([{ name: 'pdf', maxCount: 1 }, { name: 'cover', maxCount: 1 }]);

exports.uploadFiles = upload;

/**
 * @desc    Create a new book (Admin Only)
 * @route   POST /api/books
 */
exports.createBook = async (req, res) => {
    try {
        const { title, author, category, description, price, isFree } = req.body;
        
        const pdfUrl = req.files['pdf'] ? `/uploads/${req.files['pdf'][0].filename}` : '';
        const coverImage = req.files['cover'] ? `/uploads/${req.files['cover'][0].filename}` : '';

        if (!pdfUrl) {
            return res.status(400).json({ message: 'E-Book PDF file is mandatory.' });
        }

        const book = await Book.create({
            title,
            author,
            category,
            description,
            price: isFree === 'true' || isFree === true ? 0 : Number(price),
            isFree: isFree === 'true' || isFree === true,
            pdfUrl,
            coverImage,
            uploadedBy: req.user.id
        });

        // Broadcast notification to all scholars
        const User = require('../models/User');
        await User.updateMany(
            { role: 'user' },
            { 
                $push: { 
                    notifications: { 
                        $each: [{ 
                            message: `[NEW VOLUME] "${book.title}" by ${book.author} has been digitized and is now available in the repository!`,
                            type: 'success',
                            read: false,
                            createdAt: new Date()
                        }], 
                        $position: 0 
                    } 
                } 
            }
        );

        res.status(201).json({
            success: true,
            message: 'Book logic digitized successfully.',
            data: book
        });
    } catch (err) {
        res.status(500).json({ message: 'Repository Failure: ' + err.message });
    }
};

/**
 * @desc    Get all books
 * @route   GET /api/books
 */
exports.getBooks = async (req, res) => {
    try {
        const { search, category, isFree } = req.query;
        let query = {};
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (category) {
            query.category = category;
        }

        if (isFree !== undefined) {
            query.isFree = isFree === 'true';
        }

        const books = await Book.find(query).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (err) {
        res.status(500).json({ message: 'Access Denied: ' + err.message });
    }
};

/**
 * @desc    Get single book by ID
 * @route   GET /api/books/:id
 */
exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Resource not found in Bookflix index.' });
        res.json({ success: true, data: book });
    } catch (err) {
        res.status(500).json({ message: 'Protocol Error: ' + err.message });
    }
};

/**
 * @desc    Update book (Admin Only)
 * @route   PUT /api/books/:id
 */
exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true, runValidators: true }
        );
        if (!book) return res.status(404).json({ message: 'Resource not found.' });
        res.json({ success: true, message: 'Resource updated.', data: book });
    } catch (err) {
        res.status(500).json({ message: 'Update Failed: ' + err.message });
    }
};

/**
 * @desc    Delete book (Admin Only)
 * @route   DELETE /api/books/:id
 */
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Resource not found.' });
        
        const bookTitle = book.title;

        // Optionally delete files from storage
        if (book.pdfUrl && !book.pdfUrl.startsWith('http')) {
            const pdfPath = path.join(__dirname, '..', book.pdfUrl);
            if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
        }
        if (book.coverImage && !book.coverImage.startsWith('http')) {
            const coverPath = path.join(__dirname, '..', book.coverImage);
            if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
        }

        await Book.findByIdAndDelete(req.params.id);
        
        // Notify all users
        const User = require('../models/User');
        await User.updateMany(
            { role: 'user' },
            { 
                $push: { 
                    notifications: { 
                        $each: [{ 
                            message: `[SECURITY] "${bookTitle}" has been permanently purged from the library by System Authority.`,
                            type: 'alert',
                            read: false,
                            createdAt: new Date()
                        }], 
                        $position: 0 
                    } 
                } 
            }
        );

        res.json({ success: true, message: 'Resource purged from repository.' });
    } catch (err) {
        res.status(500).json({ message: 'Purge Failed: ' + err.message });
    }
};

/**
 * @desc    Download book PDF
 * @route   GET /api/books/:id/download
 */
exports.downloadBookPdf = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Resource not found.' });
        if (!book.pdfUrl) return res.status(404).json({ message: 'No digital source available.' });

        if (book.pdfUrl.startsWith('http')) {
            // External URL: trigger redirect to open/download
            return res.redirect(book.pdfUrl);
        } else {
            // Local file
            const filePath = path.join(__dirname, '..', book.pdfUrl);
            if (fs.existsSync(filePath)) {
                return res.download(filePath, `${book.title}.pdf`);
            } else {
                return res.status(404).json({ message: 'File missing on server.' });
            }
        }
    } catch (err) {
        res.status(500).json({ message: 'Download Error: ' + err.message });
    }
};
