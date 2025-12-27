const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    productId: {
        type: String, // Keeping as String to match CSV Product ID easily, can be Ref if needed
        required: true,
        ref: 'Product' // Optional: if we want to populate later, but productId in CSV might be string
    },
    date: {
        type: Date,
        required: true
    },
    unitsSold: {
        type: Number,
        required: true
    },
    region: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Index for faster queries on product and date
salesSchema.index({ productId: 1, date: 1 });

module.exports = mongoose.model('Sales', salesSchema);
