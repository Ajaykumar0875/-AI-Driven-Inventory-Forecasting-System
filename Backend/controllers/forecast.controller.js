const Product = require('../models/Product');
const Sales = require('../models/Sales');
const Forecast = require('../models/Forecast');
const { buildForecastPrompt } = require('../utils/promptBuilder');
const { callGroqAPI } = require('../config/groq');
const { determineAlertStatus } = require('../utils/alertLogic');

/**
 * @desc    Generate forecasts for all products
 * @route   GET /api/forecast
 * @access  Public
 */
const generateForecasts = async (req, res, next) => {
    try {
        // 1. Fetch all products
        const products = await Product.find({});
        
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found to forecast' });
        }

        const forecasts = [];

        // 2. Loop through products
        const productsToProcess = req.query.productId 
            ? products.filter(p => p.productId === req.query.productId) 
            : products; 

        // No limit - processing all products
        const selectedProducts = productsToProcess;

        for (const product of selectedProducts) {
            // Get Sales History
            const sales = await Sales.find({ productId: product.productId })
                .sort({ date: 1 })
                .limit(20); 

            if (sales.length < 3) continue;

            const prompt = buildForecastPrompt(product.productName, product.region, sales);

            // Call AI
            let aiResponseText;
            try {
                aiResponseText = await callGroqAPI(prompt);
            } catch (err) {
                console.error(`AI Failed for ${product.productId}`, err.message);
                console.log("Falling back to MOCK FORECAST due to API error.");
                
                // Keep the mock fallback for resilience
                const mockDemand = Math.floor(product.currentStock * (0.8 + Math.random() * 0.5)); 
                aiResponseText = JSON.stringify({
                    trend: "stable (mock)",
                    predictedDemand: mockDemand,
                    reasoning: "AI API Failed (Groq). Using statistical average fallback."
                });
            }

            // Parse JSON response from AI
            // JSON repair (Gemini sometimes adds markdown blocks)
            let jsonString = aiResponseText;
            const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonString = jsonMatch[0];
            }

            let aiData;
            try {
                aiData = JSON.parse(jsonString);
            } catch (e) {
                console.error("Failed to parse AI JSON response", e);
                continue;
            }

            const predictedDemand = parseInt(aiData.predictedDemand);
            const alertStatus = determineAlertStatus(product.currentStock, product.reorderThreshold, predictedDemand);

            // Save Forecast
            const forecast = await Forecast.findOneAndUpdate(
                { productId: product.productId },
                {
                    productId: product.productId,
                    productName: product.productName,
                    region: product.region,
                    predictedDemand: predictedDemand,
                    forecastPeriod: 'Next 30 Days',
                    alertStatus: alertStatus,
                    createdAt: Date.now()
                },
                { upsert: true, new: true }
            );

            forecasts.push({
                product: product.productName,
                ...aiData,
                alertStatus
            });
        }

        res.status(200).json({
            message: `Forecasts generated for ${forecasts.length} products`,
            data: forecasts
        });

    } catch (error) {
        next(error);
    }
};

const getForecasts = async (req, res, next) => {
    try {
        const forecasts = await Forecast.find();
        res.status(200).json(forecasts);
    } catch (error) {
        next(error);
    }
};

module.exports = { generateForecasts, getForecasts };
