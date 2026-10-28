import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    
    if (!question) {
      return new Response(JSON.stringify({ error: "No question" }), { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "No API Key" }), { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      `Wewe ni Mwalimu AI. Jibu swali hili kwa Kiswahili rahisi: ${question}`
    );
    
    const text = result.response.text();

    return new Response(JSON.stringify({ answer: text }), {
      headers: { "Content-Type": "application/json" },
    });
    
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
