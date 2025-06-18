import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(req: Request) {
  const { conversation, mood } = await req.json()

  const systemPrompt = `You are a wellness journal assistant. Your task is to create a meaningful journal entry based on a conversation between a user and their wellness companion.

Guidelines:
- Extract the key emotional themes and insights from the conversation
- Write in first person as if the user is writing the entry
- Focus on feelings, thoughts, and any breakthroughs or realizations
- Keep it concise but meaningful
- Include any coping strategies or positive insights discussed
- Make it feel personal and reflective

The journal entry should capture the essence of what the user shared and any growth or insights from the conversation.`

  try {
    const { text } = await generateText({
      model: openai("gpt-4.1-nano"),
      system: systemPrompt,
      prompt: `Create a journal entry based on this conversation. User's mood: ${mood || "Not specified"}

Conversation:
${conversation.map((msg: any) => `${msg.role === "user" ? "Me" : "Companion"}: ${msg.content}`).join("\n\n")}`,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return Response.json({ entry: text })
  } catch (error) {
    console.error("Error generating journal entry:", error)
    return Response.json({ error: "Failed to generate journal entry" }, { status: 500 })
  }
}
