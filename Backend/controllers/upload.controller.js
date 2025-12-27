const { parseCSV } = require('../utils/csvParser');
const Product = require('../models/Product');
const Sales = require('../models/Sales');
const fs = require('fs');

/**
 * @desc    Upload and process CSV file
 * @route   POST /api/upload
 * @access  Public
 */
const uploadCSV = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = req.file.path;
        
        // 1. Parse CSV
        let parsedData;
        try {
            parsedData = await parseCSV(filePath);
        } catch (err) {
            return res.status(400).json({ message: 'Error parsing CSV file' });
        }

        if (!parsedData || parsedData.length === 0) {
            return res.status(400).json({ message: 'CSV file is empty or invalid' });
        }

        // 2. Process Data
        // We assume the CSV has columns roughly matching: ProductID, ProductName, Category, Region, Date, UnitsSold, CurrentStock, ReorderThreshold
        // We will loop and Upsert Products, then Insert Sales.

        const productsToUpsert = new Map();
        const salesToInsert = [];

        for (const row of parsedData) {
            // Flexible Key Matching (handling typical CSV headers)
            const getVal = (key) => row[key] || row[key.toLowerCase()] || row[key.toUpperCase()] || row[key.replace(/\s/g, '')];

            const productId = getVal('ProductId') || getVal('Product ID');
            const productName = getVal('ProductName') || getVal('Product Name') || 'Unknown Product';
            const category = getVal('Category') || 'Uncategorized';
            const region = getVal('Region') || 'Global';
            
            // Numbers
            const currentStock = parseInt(getVal('CurrentStock') || getVal('Current Stock') || '0');
            const reorderThreshold = parseInt(getVal('ReorderThreshold') || getVal('Reorder Threshold') || '10');
            const unitsSold = parseInt(getVal('UnitsSold') || getVal('Units Sold') || '0');
            const dateStr = getVal('Date');

            if (!productId) continue; // Skip bad rows

            // Prepare Product Upsert (Use Map to deduplicate product updates in this batch)
            // We store the LAST row's stock info for the product, or we could aggregate.
            // Requirement: "Stores static product info + thresholds"
            productsToUpsert.set(productId, {
                productId,
                productName,
                category,
                region,
                currentStock,
                reorderThreshold
            });

            // Prepare Sales Record
            if (dateStr && !isNaN(unitsSold)) {
                salesToInsert.push({
                    productId,
                    date: new Date(dateStr),
                    unitsSold,
                    region
                });
            }
        }

        // 3. Database Operations
        // Bulk Write Products
        const productOps = Array.from(productsToUpsert.values()).map(prod => ({
            updateOne: {
                filter: { productId: prod.productId },
                update: { $set: prod },
                upsert: true
            }
        }));

        if (productOps.length > 0) {
            await Product.bulkWrite(productOps);
        }

        // Bulk Insert Sales (only if valid)
        if (salesToInsert.length > 0) {
            await Sales.insertMany(salesToInsert);
        }

        // Cleanup file
        fs.unlinkSync(filePath);

        res.status(200).json({
            message: 'File processed successfully',
            productsUpdated: productOps.length,
            salesRecordsAdded: salesToInsert.length
        });

    } catch (error) {
        // Cleanup file if error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        next(error);
    }
};

module.exports = { uploadCSV };
