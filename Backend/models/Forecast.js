const mongoose = require('mongoose');

const forecastSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        ref: 'Product'
    },
    region: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    predictedDemand: {
        type: Number,
        required: true
    },
    forecastPeriod: {
        type: String, // e.g., "Next 30 Days" or "January 2024"
        required: true
    },
    alertStatus: {
        type: String,
        enum: ['SAFE', 'LOW_STOCK', 'REORDER_REQUIRED'],
        default: 'SAFE'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Forecast', forecastSchema);
