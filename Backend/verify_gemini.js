require('dotenv').config();
const axios = require('axios');

const testDirectApi = async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY is missing");
        return;
    }

    console.log("Listing Available Models for your API Key...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log("✅ API CONNECTED. Available Models:");
        const models = response.data.models;
        
        let foundSupported = false;
        if (models && models.length > 0) {
            models.forEach(m => {
                // We only care about models that can 'generateContent'
                if (m.supportedGenerationMethods.includes("generateContent")) {
                     console.log(` -> ${m.name.replace('models/', '')}`);
                     foundSupported = true;
                }
            });
        }
        
        if (!foundSupported) {
            console.log("WARNING: Zero models found that support 'generateContent'. Check Billing/Region.");
        }

    } catch (error) {
        console.log("❌ FAILED TO LIST MODELS");
        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.log("Error:", error.message);
        }
    }
};

testDirectApi();
