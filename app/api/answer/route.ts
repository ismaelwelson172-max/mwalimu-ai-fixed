import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    
    if (!question) {
      return new Response(JSON.stringify({ answer: "Tafadhali andika swali" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Wewe ni Mwalimu AI. Jibu kwa Kiswahili rahisi na fupi: ${question}` }] }],
    });
    
    const text = result.response.text();

    return new Response(JSON.stringify({ answer: text }), {
      headers: { "Content-Type": "application/json" },
    });
    
  } catch (error: any) {
    console.error("GEMINI ERROR:", error);
    return new Response(JSON.stringify({ answer: `Pole, kuna hitilafu: ${error.message}. Jaribu swali fupi kama 2x5` }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
