/**
 * Builds the prompt for Claude API.
 * 
 * @param {string} productName 
 * @param {string} region 
 * @param {Array} salesHistory - Array of { date, unitsSold }
 * @returns {string} The prompt string
 */
const buildForecastPrompt = (productName, region, salesHistory) => {
    // Format sales history for readability
    // Assuming simple list of recent months for brevity in prompt
    const historyStr = salesHistory.map(record => 
        `- ${new Date(record.date).toLocaleDateString()}: ${record.unitsSold} units`
    ).join('\n');

    return `
You are an expert inventory forecasting assistant.
Analyze the sales trend for the following product and predict the demand for the next 30 days.

Product: ${productName}
Region: ${region}

Sales History:
${historyStr}

Instructions:
1. Analyze the trend (increasing, decreasing, seasonal, or stable).
2. Predict the total units needed for the NEXT 30 days.
3. Provide a JSON response ONLY in the following format:
{
  "trend": "upward/downward/stable",
  "predictedDemand": <number>,
  "reasoning": "<short explanation>"
}
Do not include any text outside the JSON object.
`;
};

module.exports = { buildForecastPrompt };
