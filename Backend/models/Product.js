const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true
    },
    productName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    currentStock: {
        type: Number,
        required: true,
        default: 0
    },
    reorderThreshold: {
        type: Number,
        required: true,
        default: 10
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
