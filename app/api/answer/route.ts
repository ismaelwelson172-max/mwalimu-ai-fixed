import { generateText, Output } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'

const SUBJECTS = [
  { id: 'math', label: 'Mathematics' },
  { id: 'english', label: 'English' },
  { id: 'kiswahili', label: 'Kiswahili' },
  { id: 'science', label: 'Science' },
  { id: 'social', label: 'Social Studies' },
  { id: 'cre', label: 'CRE' },
  { id: 'other', label: 'Other' },
]
export const maxDuration = 30
const requestSchema = z.object({
  grade: z.number().int().min(1).max(9),
  subject: z.enum(SUBJECTS.map((s) => s.id) as [string, ...string[]]),
  question: z.string().trim().min(2).max(1500),
})
const answerSchema = z.object({
  answer: z.string(),
  explanation: z.string(),
  steps: z.array(z.string()),
  topic: z.string(),
  tip: z.string(),
})
export async function POST(req: Request) {
  const parsed = requestSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: 'Swali si sahihi' }, { status: 400 })
  const { grade, question } = parsed.data
  try {
    const { output } = await generateText({
      model: google('gemini-2.0-flash'),
      output: Output.object({ schema: answerSchema }),
      system: `You are Mwalimu AI, Kenyan CBC teacher Grade ${grade}. Explain in simple Kiswahili.`,
      prompt: question,
    })
    return Response.json({ ...output, source: 'ai' })
  } catch (e) {
    console.error(e)
    return Response.json({ answer: 'Jaribu tena', explanation: 'Mtandao na shida', steps: [], topic: 'General', tip: 'Jaribu tena', source: 'mock' })
  }
}
