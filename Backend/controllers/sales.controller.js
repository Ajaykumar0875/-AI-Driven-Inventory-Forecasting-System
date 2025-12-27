const Sales = require('../models/Sales');

/**
 * @desc    Get aggregated sales history (e.g. for charts)
 * @route   GET /api/sales
 * @access  Public
 */
const getSalesHistory = async (req, res, next) => {
    try {
        const { productId } = req.query;
        let query = {};
        
        if (productId) {
            query.productId = productId;
        }

        const sales = await Sales.find(query).sort({ date: 1 });
        res.status(200).json(sales);
    } catch (error) {
        next(error);
    }
};

module.exports = { getSalesHistory };
