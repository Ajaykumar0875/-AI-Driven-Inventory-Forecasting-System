/**
 * Determines the alert status based on prediction and current stock.
 * 
 * Rules:
 * - if (predictedDemand > currentStock) => REORDER_REQUIRED
 * - if (currentStock - predictedDemand < reorderThreshold) => LOW_STOCK
 * - else => SAFE
 * 
 * @param {number} currentStock 
 * @param {number} reorderThreshold 
 * @param {number} predictedDemand 
 * @returns {string} Alert Status
 */
const determineAlertStatus = (currentStock, reorderThreshold, predictedDemand) => {
    if (predictedDemand > currentStock) {
        return "REORDER_REQUIRED";
    } else if ((currentStock - predictedDemand) < reorderThreshold) {
        return "LOW_STOCK";
    } else {
        return "SAFE";
    }
};

module.exports = { determineAlertStatus };
