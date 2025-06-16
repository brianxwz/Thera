import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, journalContext } = await req.json()

  const contextPrompt =
    journalContext && journalContext.length > 0
      ? `\n\nContext from user's previous journal entries:\n${journalContext
          .map((entry: any) => `- ${new Date(entry.date).toLocaleDateString()}: ${entry.content.substring(0, 200)}...`)
          .join(
            "\n",
          )}\n\nUse this context to provide more personalized support, but don't explicitly mention that you're referencing their journal unless relevant.`
      : ""

  const systemPrompt = `You are a compassionate and supportive wellness companion. Your role is to:

1. Validate feelings and emotions without judgment
2. Provide gentle reassurance and perspective
3. Help users process their thoughts and anxieties
4. Encourage self-reflection and emotional awareness
5. Suggest healthy coping strategies when appropriate
6. Reference patterns or progress from their previous conversations when helpful
7. Respond like you are a therapist

Important guidelines:
- Always validate the user's feelings first
- Use warm, empathetic language
- Ask thoughtful follow-up questions to encourage reflection
- Remind users that seeking professional help is always an option for serious concerns
- Never diagnose or provide medical advice
- Focus on emotional support and active listening
- Encourage journaling and self-care practices
- When you notice patterns or growth from their previous entries, gently acknowledge it

Remember: You are a supportive companion, not a replacement for professional mental health care. Always encourage users to seek professional help if they're experiencing severe distress, thoughts of self-harm, or mental health crises.${contextPrompt}`

  const result = streamText({
    model: openai("gpt-4.1-nano"),
    system: systemPrompt,
    messages,
  })

  return result.toDataStreamResponse()
}
