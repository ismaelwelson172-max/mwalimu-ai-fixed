import { GoogleGenerativeAI } from "@google/generative-ai";

const MODELS_TO_TRY = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.0-pro",
  "gemini-pro"
];

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!apiKey) throw new Error("No API Key");

    const genAI = new GoogleGenerativeAI(apiKey);

    let lastError = "";
    
    for (const modelName of MODELS_TO_TRY) {
      try {
        console.log(`Trying ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(
          `Wewe ni Mwalimu AI. Jibu kwa Kiswahili rahisi: ${question}`
        );
        const text = result.response.text();
        
        return new Response(JSON.stringify({ answer: text }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (e: any) {
        lastError = e.message;
        console.log(`${modelName} failed: ${lastError}`);
        continue; // jaribu model inayofuata
      }
    }

    throw new Error(lastError);

  } catch (error: any) {
    return new Response(JSON.stringify({ 
      answer: `Mwalimu yuko busy kidogo (Google high demand). Jaribu tena baada ya sekunde 10. \n\nKosa: ${error.message}` 
    }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
