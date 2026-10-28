import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req: Request) {
  try {
    const { grade, question } = await req.json();
    
    const { text } = await generateText({
      model: google('gemini-2.0-flash'),
      system: 'You are Mwalimu AI, a helpful Kenyan teacher. Explain clearly for the grade given.',
      prompt: `Grade: ${grade}\nQuestion: ${question}\nAnswer in simple, clear Swahili and English mix.`,
    });

    return Response.json({ answer: text });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed' }, { status: 500 });
  }
}
