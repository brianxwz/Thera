import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { conversation, mood } = await req.json()

    const systemPrompt = `You are a wellness journal assistant. Your task is to create a meaningful journal entry based on a conversation between a user and their wellness companion.

Guidelines:
- Extract the key emotional themes and insights from the conversation
- Write in first person as if the user is writing the entry
- Focus on feelings, thoughts, and any breakthroughs or realizations
- Keep it concise but meaningful (2-3 paragraphs max)
- Include any coping strategies or positive insights discussed
- Make it feel personal and reflective

The journal entry should capture the essence of what the user shared and any growth or insights from the conversation.

${mood ? `Current mood: ${mood}` : ''}`

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `Create a journal entry based on this conversation:\n\n${conversation.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return NextResponse.json({ 
      entry: response.choices[0].message.content 
    })
  } catch (error) {
    console.error('Journal API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate journal entry' },
      { status: 500 }
    )
  }
}
