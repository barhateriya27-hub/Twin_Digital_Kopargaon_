import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;
if (!key || key === 'YOUR_GEMINI_API_KEY') {
  console.error("Error: GEMINI_API_KEY is not set in your .env file or environment variables.");
  process.exit(1);
}

console.log("Checking Gemini API key:", key.substring(0, 6) + "..." + key.substring(key.length - 4));

const genAI = new GoogleGenerativeAI(key);
async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello, respond with 'System OK' if you can read this.");
    console.log("Response from Gemini:", result.response.text().trim());
  } catch (err) {
    console.error("Error calling Gemini API:", err.message);
  }
}
run();
