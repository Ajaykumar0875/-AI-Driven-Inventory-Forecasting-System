const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const callGroqAPI = async (prompt) => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not defined");
    }

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
            stop: null
        });

        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Groq API Full Error:", error);
        throw new Error(`Groq API Failed: ${error.message}`);
    }
};

module.exports = { callGroqAPI };
