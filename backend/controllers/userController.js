const User = require('../models/User');
const Book = require('../models/Book');

exports.getSavedBooks = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('savedBooks');
        res.json({ success: true, data: user.savedBooks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.toggleSaveBook = async (req, res) => {
    try {
        const { bookId } = req.body;
        if (!bookId) {
            return res.status(400).json({ success: false, message: 'bookId is required' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Compare as strings to avoid ObjectId vs string mismatch
        const alreadySaved = user.savedBooks.some(id => id.toString() === bookId.toString());

        if (alreadySaved) {
            await User.findByIdAndUpdate(req.user.id, { $pull: { savedBooks: bookId } });
            return res.json({ success: true, message: 'Book removed from library', saved: false });
        } else {
            await User.findByIdAndUpdate(req.user.id, { $addToSet: { savedBooks: bookId } });
            return res.json({ success: true, message: 'Book saved to library', saved: true });
        }
    } catch (err) {
        console.error('toggleSaveBook error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};


exports.getNotifications = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ success: true, data: user.notifications.sort((a,b) => b.createdAt - a.createdAt) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.markNotificationsRead = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.notifications.forEach(n => n.read = true);
        await user.save();
        res.json({ success: true, message: 'Notifications cleared' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
