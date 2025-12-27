const { callGroqAPI } = require('./config/groq');
require('dotenv').config();

const testGroq = async () => {
    console.log("Testing Groq API Connection...");
    try {
        const response = await callGroqAPI("Hello, are you online? Reply with 'Yes, connected'.");
        console.log("Groq Response:", response);
    } catch (error) {
        console.error("Verification Failed:", error.message);
    }
};

testGroq();
