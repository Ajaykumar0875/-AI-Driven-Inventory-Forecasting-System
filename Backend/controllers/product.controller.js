const Product = require('../models/Product');
const Forecast = require('../models/Forecast');

/**
 * @desc    Get all products with their latest alert status
 * @route   GET /api/products/alerts
 * @access  Public
 */
const getProductsAndAlerts = async (req, res, next) => {
    try {
        const products = await Product.find({});
        
        // Fetch latest forecasts for these products to join Alert Status
        // Optimized: In real app, might want to .populate() or keep alertStatus in Product model,
        // but keeping clear separation as per schema.
        
        const result = await Promise.all(products.map(async (p) => {
            const forecast = await Forecast.findOne({ productId: p.productId })
                                           .sort({ createdAt: -1 }); // Latest
            
            return {
                ...p.toObject(),
                latestAlert: forecast ? forecast.alertStatus : 'UNKNOWN',
                latestPrediction: forecast ? forecast.predictedDemand : null
            };
        }));

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = { getProductsAndAlerts };
