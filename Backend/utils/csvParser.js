const csv = require('csv-parser');
const fs = require('fs');

const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const requiredHeaders = ['ProductId', 'Date', 'UnitsSold', 'Region']; // Minimal requirements

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('headers', (headers) => {
                console.log('Detected CSV Headers:', headers); // DEBUG LOG
            })
            .on('data', (data) => {
                // Map keys to normalize (remove spaces, etc if needed)
                // Assuming standard "Product ID" -> "productId" mapping will be done in controller or here.
                // Let's just return the raw object and let controller sanitize.
                results.push(data);
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

module.exports = { parseCSV };
