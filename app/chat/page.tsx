"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/components/supabase-auth-provider"
import { createJournalEntry, getJournalEntries } from "@/lib/journal"
import { JournalEntry, Message, MoodOption } from "@/lib/types"
import {
  Heart,
  MessageCircle,
  Send,
  Sparkles,
  User,
  Bot,
  Plus,
  BookOpen,
  Lock,
} from "lucide-react"

export default function ChatPage() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [currentMood, setCurrentMood] = useState("")
  const [isGeneratingEntry, setIsGeneratingEntry] = useState(false)
  const [showNewChatDialog, setShowNewChatDialog] = useState(false)
  const [showSaveSuccessDialog, setShowSaveSuccessDialog] = useState(false)
  const [lastSavedMessageCount, setLastSavedMessageCount] = useState(0)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    body: {
      journalContext: journalEntries.slice(-5), // Send last 5 entries for context
    },
  })

  const { user, isAuthenticated } = useAuth()

  // Fetch journal entries from database
  const fetchJournalEntries = async () => {
    try {
      const entries = await getJournalEntries()
      if (entries) {
        setJournalEntries(entries)
      }
    } catch (error) {
      console.error('Failed to fetch journal entries:', error)
    }
  }

  useEffect(() => {
    fetchJournalEntries()
  }, [])

  const generateJournalEntry = async (conversation: Message[], showSuccessDialog = false) => {
    if (!isAuthenticated) {
      // Redirect to login or show auth modal
      return
    }
    if (conversation.length < 2) return
    setIsGeneratingEntry(true)
    try {
      const response = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: conversation,
          mood: currentMood,
        }),
      })

      const { entry } = await response.json()

      // Save to database instead of localStorage
      const savedEntry = await createJournalEntry(user?.id || "", entry, currentMood, extractTags(entry), Date.now().toString())

      if (savedEntry) {
        setJournalEntries(prev => [savedEntry, ...prev])
        setLastSavedMessageCount(messages.length)
        
        if (showSuccessDialog) {
          setShowSaveSuccessDialog(true)
        }
      }
    } catch (error) {
      console.error("Failed to generate journal entry:", error)
    } finally {
      setIsGeneratingEntry(false)
    }
  }

  const extractTags = (content: string): string[] => {
    const commonEmotions = [
      "anxious",
      "stressed",
      "happy",
      "sad",
      "worried",
      "excited",
      "grateful",
      "frustrated",
      "calm",
      "overwhelmed",
      "peaceful",
      "hopeful",
      "confident",
      "lonely",
      "proud",
      "scared",
      "relieved",
      "motivated",
      "tired",
      "energetic",
    ]
    return commonEmotions.filter((emotion) => content.toLowerCase().includes(emotion))
  }

  const moodOptions: MoodOption[] = [
    { emoji: "😊", label: "Great", color: "bg-green-100 text-green-700 hover:bg-green-200" },
    { emoji: "🙂", label: "Good", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
    { emoji: "😐", label: "Okay", color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
    { emoji: "😔", label: "Low", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
    { emoji: "😰", label: "Anxious", color: "bg-orange-100 text-orange-700 hover:bg-orange-200" },
    { emoji: "🙏", label: "Grateful", color: "bg-pink-100 text-pink-700 hover:bg-pink-200" },
  ]

  const handleMoodSelect = (mood: MoodOption) => {
    setCurrentMood(`${mood.emoji} ${mood.label}`)
  }

  const startNewConversation = () => {
    // Check if there are unsaved messages
    if (messages.length > lastSavedMessageCount) {
      setShowNewChatDialog(true)
      return
    }
    
    // If no unsaved messages, start new chat
    setMessages([])
    setCurrentMood("")
    setLastSavedMessageCount(0)
  }

  const handleNewChatConfirm = async (shouldSave: boolean) => {
    if (shouldSave) {
      await generateJournalEntry(messages)
    }
    setMessages([])
    setCurrentMood("")
    setLastSavedMessageCount(0)
    setShowNewChatDialog(false)
  }

  const handleSaveSuccessConfirm = (startNewChat: boolean) => {
    if (startNewChat) {
      setMessages([])
      setCurrentMood("")
      setLastSavedMessageCount(0)
    }
    setShowSaveSuccessDialog(false)
  }

  return (
    <main>
      <div className="container mx-auto p-4 max-w-7xl">
        <Card className="min-h-[calc(100vh-8rem)] shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden dark:bg-gray-800/90 dark:border-gray-700">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Heart className="h-6 w-6" />
                  <h1 className="text-xl font-bold">Chat Support</h1>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={startNewConversation}
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    disabled={messages.length === 0}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Chat
                  </Button>
                  <Button
                    onClick={() => generateJournalEntry(messages, true)}
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    disabled={messages.length === 0 || isGeneratingEntry || messages.length === lastSavedMessageCount || !isAuthenticated}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    {isAuthenticated ? "Save as Journal Entry" : "Sign In to Save"}
                  </Button>
                </div>
              </div>
              <p className="text-purple-100 mb-4">How are you feeling right now?</p>

              {/* Mood Selection */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {moodOptions.map((mood) => (
                  <Button
                    key={mood.label}
                    variant="outline"
                    size="sm"
                    className={`h-12 flex flex-col gap-1 transition-all duration-200 bg-white/10 border-white/20 text-white hover:bg-white/20 ${
                      currentMood === `${mood.emoji} ${mood.label}` ? "bg-white/30 border-white/50" : ""
                    }`}
                    onClick={() => handleMoodSelect(mood)}
                  >
                    <span className="text-lg">{mood.emoji}</span>
                    <span className="text-xs">{mood.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-gradient-to-b from-gray-50 to-white dark:from-gray-700 dark:to-gray-800">
              <ScrollArea className="h-full p-6">
                {/* Authentication Notice */}
                {!isAuthenticated && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-900/20 dark:border-amber-800">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                      <Lock className="h-4 w-4" />
                      <span className="text-sm font-medium">Sign in to save conversations as journal entries</span>
                    </div>
                  </div>
                )}

                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg mb-6">
                      <Heart className="h-10 w-10 text-white animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 dark:text-white">I'm here to listen</h2>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed dark:text-gray-300">
                      Share what's on your mind. I'll help you process your thoughts and feelings, and automatically create
                      journal entries to track your wellness journey.
                    </p>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-6 flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <Avatar className="w-10 h-10 shadow-md">
                      <AvatarFallback
                        className={
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            : "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                        }
                      >
                        {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>

                    <div className={`max-w-[75%] ${message.role === "user" ? "text-right" : "text-left"}`}>
                      <div
                        className={`inline-block p-4 rounded-2xl shadow-md ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md"
                            : "bg-white border border-gray-200 text-gray-800 rounded-bl-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        }`}
                      >
                        <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 px-2">
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 mb-6">
                    <Avatar className="w-10 h-10 shadow-md">
                      <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-md shadow-md">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                        <span className="text-gray-600">Listening and thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                {isGeneratingEntry && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Sparkles className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Creating journal entry from our conversation...</span>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t dark:bg-gray-800 dark:border-gray-700">
              <form onSubmit={handleSubmit}>
                <div className="flex gap-3 p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-purple-400 transition-colors dark:bg-gray-700 dark:border-gray-600">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Share what's on your mind... 💜"
                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-lg placeholder:text-gray-400"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Card>
      </div>

      {/* New Chat Confirmation Dialog */}
      <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100">
              <MessageCircle className="h-6 w-6 text-blue-700" aria-hidden="true" />
            </div>
            <div>
              <DialogTitle>Save Current Chat?</DialogTitle>
              <DialogDescription className="mt-2">
                Would you like to save the current conversation as a journal entry before starting a new chat?
              </DialogDescription>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => handleNewChatConfirm(false)}>
              Don't Save
            </Button>
            <Button onClick={() => handleNewChatConfirm(true)} disabled={messages.length === 0 || isGeneratingEntry || messages.length === lastSavedMessageCount || !isAuthenticated}>
              {isAuthenticated ? "Save as Journal Entry" : "Sign In to Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Success Dialog */}
      <Dialog open={showSaveSuccessDialog} onOpenChange={setShowSaveSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100">
              <BookOpen className="h-6 w-6 text-green-700" aria-hidden="true" />
            </div>
            <div>
              <DialogTitle>Journal Entry Saved!</DialogTitle>
              <DialogDescription className="mt-2">
                Your conversation has been saved as a journal entry. Would you like to continue chatting or start a new conversation?
              </DialogDescription>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => handleSaveSuccessConfirm(false)}>
              Continue Chatting
            </Button>
            <Button onClick={() => handleSaveSuccessConfirm(true)}>
              Start New Chat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
} 