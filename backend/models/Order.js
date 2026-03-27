const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    amount: { type: Number, required: true },
    paymentStatus: { 
        type: String, 
        enum: ['Paid', 'Pending', 'Reversed', 'Refunded'], 
        default: 'Paid' 
    },
    transactionId: { type: String, default: () => `BFX-${Math.random().toString(36).substr(2, 9).toUpperCase()}` },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
