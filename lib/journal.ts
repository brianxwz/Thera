import { supabase } from "./supabase"
import { Message } from "./types"

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

export async function createConversation(userId: string, mood?: string) {
  const { data: conversation, error } = await supabase
    .from('conversations')
    .insert({
      user_id: userId,
      mood: mood || null,
      title: `Conversation ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating conversation:', error)
    return null
  }

  return conversation
}

export async function saveConversationMessages(conversationId: string, messages: Message[]) {
  const { error } = await supabase
    .from('conversation_messages')
    .insert(
      messages.map(msg => ({
        conversation_id: conversationId,
        role: msg.role,
        content: msg.content,
      }))
    )

  if (error) {
    console.error('Error saving conversation messages:', error)
    return false
  }

  return true
}

export async function getConversationMessages(conversationId: string) {
  const { data: messages, error } = await supabase
    .from('conversation_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching conversation messages:', error)
    return null
  }

  return messages
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