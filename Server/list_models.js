const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("API Key not found in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        // For some versions of the SDK, listModels is not directly on genAI,
        // but managed via a ModelManager or similar.
        // However, usually we can just try to hit the API or generic model fetch.
        // The SDK doesn't always expose listModels easily in the main entry point in older versions,
        // but let's try the standard way if available, or just a known working model.

        // Actually, checking SDK docs, it's often not exposed directly in the high-level client.
        // Let's rely on trying the 'gemini-1.5-flash-001' variant which is more specific.
        // But to be sure, let's try to verify if we can make a simple call with 'gemini-pro'.

        console.log("Testing gemini-1.5-flash-001...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        const result = await model.generateContent("Hello");
        console.log("gemini-1.5-flash-001 works!");

    } catch (error) {
        console.error("gemini-1.5-flash-001 failed:", error.message);

        try {
            console.log("Testing gemini-pro...");
            const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
            const resultPro = await modelPro.generateContent("Hello");
            console.log("gemini-pro works!");
        } catch (e) {
            console.error("gemini-pro failed:", e.message);
        }
    }
}

listModels();
