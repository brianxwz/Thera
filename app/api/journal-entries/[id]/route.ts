import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { content, mood, tags } = body

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const { data: entry, error } = await supabase
      .from('journal_entries')
      .update({
        content,
        mood: mood || null,
        tags: tags || [],
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating journal entry:', error)
      return NextResponse.json({ error: "Failed to update entry" }, { status: 500 })
    }

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    return NextResponse.json({ entry })
  } catch (error) {
    console.error('Error in PUT /api/journal-entries/[id]:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting journal entry:', error)
      return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/journal-entries/[id]:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 