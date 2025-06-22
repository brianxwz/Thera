export interface JournalEntry {
  id: string
  user_id: string
  content: string
  mood?: string
  tags: string[]
  conversation_id?: string
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  user_id: string
  title?: string
  mood?: string
  created_at: string
  updated_at: string
}

export interface ConversationMessage {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

export interface Message {
  role: 'user' | 'assistant' | 'system' | 'data'
  content: string
  id: string
}

export interface MoodOption {
  emoji: string
  label: string
  color: string
}

export interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  href: string
} 