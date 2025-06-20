import { supabase } from "./supabase"

export async function createJournalEntry(userId: string, content: string, mood: string, tags: string[], conversationId?: string | null) {
  const { data: entry, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        content,
        mood: mood || null,
        tags: tags || [],
        conversation_id: conversationId || null,
      })
      .select()
      .single()

  if (error) {
    return null
  }

  return entry
}

export async function getJournalEntries() {
  const { data: entries, error } = await supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false })

  if (error) {
    return null
  }

  return entries
}

export async function updateJournalEntry(id: string, content: string, mood: string, tags: string[]) {
  const { data: entry, error } = await supabase
      .from('journal_entries')
      .update({
        content,
        mood: mood || null,
        tags: tags || [],
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

  if (error) {
    return null
  }

  return entry
}

export async function deleteJournalEntry(id: string) {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)

  if (error) {
    return null
  }

  return true
}