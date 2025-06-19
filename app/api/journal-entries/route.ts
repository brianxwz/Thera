import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(_request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: entries, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching journal entries:', error)
      return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 })
    }

    return NextResponse.json({ entries })
  } catch (error) {
    console.error('Error in GET /api/journal-entries:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { content, mood, tags, conversationId } = body

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const { data: entry, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: user.id,
        content,
        mood: mood || null,
        tags: tags || [],
        conversation_id: conversationId || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating journal entry:', error)
      return NextResponse.json({ error: "Failed to create entry" }, { status: 500 })
    }

    return NextResponse.json({ entry })
  } catch (error) {
    console.error('Error in POST /api/journal-entries:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 