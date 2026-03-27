const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
        const { bookId, amount } = req.body;
        
        // Check if already purchased
        const existing = await Order.findOne({ user: req.user.id, book: bookId });
        if (existing) {
            return res.status(400).json({ message: 'Volume already exists in your personal library.' });
        }

        const order = await Order.create({
            user: req.user.id,
            book: bookId,
            amount,
            status: 'Completed'
        });

        res.status(201).json({
            success: true,
            message: 'Transaction verified. Volume added to repository.',
            data: order
        });
    } catch (err) {
        res.status(500).json({ message: 'Transaction Failure: ' + err.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('book');
        res.json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        res.status(500).json({ message: 'Access Denied: ' + err.message });
    }
};
