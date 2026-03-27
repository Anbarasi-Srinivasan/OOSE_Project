const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: 0 },
    isFree: { type: Boolean, default: true },
    pdfUrl: { type: String, required: true },
    coverImage: { type: String }, // Renamed from coverImageUrl
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);
