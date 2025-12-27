const { callGroqAPI } = require('../config/groq');
const Product = require('../models/Product');
const Forecast = require('../models/Forecast');

const handleChatQuery = async (req, res, next) => {
    try {
        const { message } = req.body;

        // 1. Gather System Context (The "Brain")
        const products = await Product.find({});
        const forecasts = await Forecast.find({});

        // Calculate Stats
        const lowStockProducts = products.filter(p => p.currentStock <= p.reorderThreshold);
        const criticalForecasts = forecasts.filter(f => f.alertStatus === 'REORDER_REQUIRED');
        
        // Context Summary Object
        const context = {
            totalProducts: products.length,
            lowStockCount: lowStockProducts.length,
            lowStockItems: lowStockProducts.map(p => `${p.productName} (Stock: ${p.currentStock})`).join(', '),
            criticalForecasts: criticalForecasts.map(f => `Product ${f.productId} needs ${f.predictedDemand} units`).join(', ')
        };

        // 2. Build Prompt
        const systemPrompt = `
        You are StockGPT, an expert AI Inventory Assistant for the 'StockSense' platform.
        You have real-time access to the user's warehouse data.
        
        CURRENT SYSTEM STATUS:
        - Total Products: ${context.totalProducts}
        - Products needing immediate reorder: ${context.lowStockCount}
        - Specifically low stock: ${context.lowStockItems || "None"}
        - Forecasts indicating shortages: ${context.criticalForecasts || "None"}

        USER QUERY: "${message}"

        INSTRUCTIONS:
        - Answer concisely in plain English.
        - If the user asks about reorders, list the specific products from the status above.
        - Be helpful and professional.
        - If you don't know, say you don't have that specific data point.
        `;

        // 3. Call AI
        const aiResponse = await callGroqAPI(systemPrompt);

        // 4. Return
        res.status(200).json({ reply: aiResponse });

    } catch (error) {
        console.error('Chat Error:', error.message);
        
        // Fallback Logic: If AI fails (e.g., Quota), return a scripted response based on data.
        // This ensures the demo never "breaks" for the user.
        try {
            // Re-calculate context locally for the fallback
            const products = await Product.find({});
            const lowStockCount = products.filter(p => p.currentStock <= p.reorderThreshold).length;
            
            const fallbackReply = `(AI Offline) I currently have limited connectivity, but here is your status: You have ${products.length} total products, and ${lowStockCount} items require reordering. Please check the Dashboard for details.`;
            
            res.status(200).json({ reply: fallbackReply });
        } catch (innerError) {
             res.status(500).json({ reply: "System Error: Unable to access database." });
        }
    }
};

module.exports = { handleChatQuery };
