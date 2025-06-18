"use client"

import { useState, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { InteractiveTutorial } from "@/components/interactive-tutorial"
import { JournalEntryModal } from "@/components/journal-entry-modal"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { JournalFilters } from "@/components/journal-filters"
import { AppHeader } from "@/components/app-header"
import { AuthModal } from "@/components/auth-modal"
import { PricingModal } from "@/components/pricing-modal"
import {
  Heart,
  MessageCircle,
  BookOpen,
  AlertCircle,
  Send,
  Sparkles,
  User,
  Bot,
  TrendingUp,
  Settings,
  X,
  Plus,
  Home,
  Play,
  Edit3,
  Trash2,
  PenTool,
} from "lucide-react"

interface JournalEntry {
  id: string
  date: string
  content: string
  mood?: string
  tags: string[]
  conversationId?: string
}

interface NavigationItem {
  id: string
  label: string
  icon: any
  badge?: number
}

export default function WellnessCompanion() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([])
  const [currentMood, setCurrentMood] = useState("")
  const [activeSection, setActiveSection] = useState("chat")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarHovered, setSidebarHovered] = useState(false)
  const [isGeneratingEntry, setIsGeneratingEntry] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [showJournalModal, setShowJournalModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [isPremium, setIsPremium] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true) // Default to dark mode

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    body: {
      journalContext: journalEntries.slice(-5), // Send last 5 entries for context
    },
    onFinish: async (message) => {
      // Auto-generate journal entry after meaningful conversations
      if (messages.length >= 2) {
        // At least one exchange
        await generateJournalEntry([...messages, message])
      }
    },
  })

  useEffect(() => {
    const saved = localStorage.getItem("wellness-journal")
    if (saved) {
      setJournalEntries(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem("wellness-onboarding-completed")
    if (!hasCompletedOnboarding) {
      // TODO: Uncomment this when we have a tutorial
      //setShowTutorial(true)
    }
  }, [])

  useEffect(() => {
    const handleGetStarted = () => {
      // TODO: Uncomment this when we have a tutorial
      //setShowTutorial(true)
    }

    window.addEventListener("get-started", handleGetStarted)
    return () => window.removeEventListener("get-started", handleGetStarted)
  }, [])

  useEffect(() => {
    const handleGoHome = () => {
      setActiveSection("home")
    }

    window.addEventListener("go-home", handleGoHome)
    return () => window.removeEventListener("go-home", handleGoHome)
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const generateJournalEntry = async (conversation: any[]) => {
    if (conversation.length < 2) return

    setIsGeneratingEntry(true)
    try {
      const response = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: conversation.slice(-6), // Last 3 exchanges
          mood: currentMood,
        }),
      })

      const { entry } = await response.json()

      const journalEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        content: entry,
        mood: currentMood,
        tags: extractTags(entry),
        conversationId: Date.now().toString(),
      }

      const updated = [journalEntry, ...journalEntries]
      setJournalEntries(updated)
      localStorage.setItem("wellness-journal", JSON.stringify(updated))
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

  const moodOptions = [
    { emoji: "😊", label: "Great", color: "bg-green-100 text-green-700 hover:bg-green-200" },
    { emoji: "🙂", label: "Good", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
    { emoji: "😐", label: "Okay", color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
    { emoji: "😔", label: "Low", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
    { emoji: "😰", label: "Anxious", color: "bg-orange-100 text-orange-700 hover:bg-orange-200" },
    { emoji: "🙏", label: "Grateful", color: "bg-pink-100 text-pink-700 hover:bg-pink-200" },
  ]

  const navigationItems: NavigationItem[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "chat", label: "Chat Support", icon: MessageCircle },
    { id: "journal", label: "My Journal", icon: BookOpen },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const handleMoodSelect = (mood: any) => {
    setCurrentMood(`${mood.emoji} ${mood.label}`)
  }

  const startNewConversation = () => {
    setMessages([])
    setCurrentMood("")
  }

  const handleTutorialComplete = () => {
    setShowTutorial(false)
    localStorage.setItem("wellness-onboarding-completed", "true")
  }

  const handleSaveJournalEntry = (entry: JournalEntry) => {
    let updated: JournalEntry[]

    if (editingEntry) {
      // Update existing entry
      updated = journalEntries.map((e) => (e.id === entry.id ? entry : e))
    } else {
      // Add new entry
      updated = [entry, ...journalEntries]
    }

    setJournalEntries(updated)
    localStorage.setItem("wellness-journal", JSON.stringify(updated))
    setEditingEntry(null)
  }

  const handleDeleteJournalEntry = (entryId: string) => {
    const updated = journalEntries.filter((entry) => entry.id !== entryId)
    setJournalEntries(updated)
    localStorage.setItem("wellness-journal", JSON.stringify(updated))
  }

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry)
    setShowJournalModal(true)
  }

  const handleNewEntry = () => {
    setEditingEntry(null)
    setShowJournalModal(true)
  }

  const handleDeleteClick = (entryId: string) => {
    setEntryToDelete(entryId)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (entryToDelete) {
      handleDeleteJournalEntry(entryToDelete)
      setEntryToDelete(null)
    }
  }

  const handleAuthenticated = (email: string, premium = false) => {
    setIsAuthenticated(true)
    setUserEmail(email)
    setIsPremium(premium)
  }

  const handleUpgrade = () => {
    setIsPremium(true)
    setShowPricingModal(false)
    // In a real app, this would handle the payment flow
  }

  const renderHomeSection = () => (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white p-12 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Heart className="h-12 w-12 text-white animate-pulse" />
            </div>
            <Sparkles className="h-8 w-8 text-yellow-300 absolute -top-2 -right-2 animate-bounce" />
          </div>
          <h1 className="text-5xl font-bold mb-6">Your Personal Wellness Companion</h1>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed max-w-2xl mx-auto">
            A safe, judgment-free space where AI meets compassion. Get emotional support, track your wellness journey,
            and build healthier mental habits. All in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setActiveSection("chat")}
              size="lg"
              className="tutorial-start-journey bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
            >
              Start Your Journey
              <Heart className="h-5 w-5 ml-2" />
            </Button>
            {/* TODO: Uncomment this when we have a tutorial
            <Button
              onClick={() => setShowTutorial(true)}
              variant="outline"
              size="lg"
              className="border-white/30 text-white backdrop-blur-sm px-8 py-4 text-lg font-semibold hover:scale-105"
            >
              Take the Tour
              <Play className="h-5 w-5 ml-2" />
            </Button> */}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 dark:text-white">
              Everything you need for mental wellness
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
              Combining AI technology with evidence-based wellness practices to support your mental health journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-purple-200 dark:bg-gray-700 dark:hover:border-purple-400">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">AI Chat Support</h3>
              <p className="text-gray-600 leading-relaxed dark:text-gray-300">
                Get 24/7 emotional support from a compassionate AI companion that listens without judgment and helps you
                process your thoughts and feelings.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-purple-200 dark:bg-gray-700 dark:hover:border-purple-400">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">Smart Journaling</h3>
              <p className="text-gray-600 leading-relaxed dark:text-gray-300">
                Automatically capture insights from your conversations or write manual entries. Track patterns, moods,
                and growth over time.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-purple-200 dark:bg-gray-700 dark:hover:border-purple-400">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">Wellness Insights</h3>
              <p className="text-gray-600 leading-relaxed dark:text-gray-300">
                Understand your emotional patterns with intelligent analytics. Identify triggers, track progress, and
                celebrate your growth.
              </p>
            </Card>
          </div>

          {/* How It Works */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-12 mb-16 dark:from-gray-700 dark:to-gray-600">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-12 dark:text-white">How it works</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3 dark:text-white">Share Your Thoughts</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Express your feelings, concerns, or celebrations in a safe, private space.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3 dark:text-white">Get Support</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Receive empathetic responses, validation, and gentle guidance from your AI companion.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3 dark:text-white">Track Progress</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Watch your wellness journey unfold through automatic journaling and insights.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6 dark:text-white">
                Why choose our wellness companion?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1 dark:text-white">Available 24/7</h4>
                    <p className="text-gray-600 dark:text-gray-300">Get support whenever you need it, day or night.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1 dark:text-white">Completely Private</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Your conversations stay on your device. No data sharing.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1 dark:text-white">No Judgment</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Express yourself freely in a safe, supportive environment.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1 dark:text-white">Evidence-Based</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Built on proven mental health and wellness practices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 text-center dark:from-gray-700 dark:to-gray-600">
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-6">
                <Heart className="h-16 w-16 text-white animate-pulse" />
              </div>
              <h4 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">Start feeling better today</h4>
              <p className="text-gray-600 mb-6 dark:text-gray-300">
                Join thousands who have found support and growth through our wellness companion.
              </p>
              <Button
                onClick={() => setActiveSection("chat")}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Begin Your Journey
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200 py-12 dark:from-amber-900/50 dark:to-orange-900/50 dark:border-amber-800">
        <div className="max-w-4xl mx-auto px-8">
          <div className="flex items-start gap-6">
            <AlertCircle className="h-8 w-8 text-amber-600 mt-1 flex-shrink-0 dark:text-amber-400" />
            <div>
              <h4 className="text-xl font-semibold text-amber-800 mb-3 dark:text-amber-200">Important Notice</h4>
              <p className="text-amber-700 leading-relaxed mb-4 dark:text-amber-300">
                This wellness companion provides emotional support and helps you process your thoughts and feelings.
                It's designed to complement, not replace, professional mental health care.
              </p>
              <p className="text-amber-700 leading-relaxed dark:text-amber-300">
                <strong>
                  If you're experiencing severe distress, thoughts of self-harm, or mental health crises, please seek
                  professional help immediately.
                </strong>{" "}
                Contact your healthcare provider, a mental health professional, or emergency services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderChatSection = () => (
    <div className="flex flex-col h-full tutorial-chat-area">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6" />
            <h2 className="text-xl font-bold">Chat Support</h2>
          </div>
          <Button
            onClick={startNewConversation}
            variant="outline"
            size="sm"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
        <p className="text-purple-100 mb-4">How are you feeling right now?</p>

        {/* Mood Selection */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 tutorial-mood-buttons">
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
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg mb-6">
                <Heart className="h-10 w-10 text-white animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3 dark:text-white">I'm here to listen</h3>
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
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
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
              className="tutorial-chat-input flex-1 border-0 bg-transparent focus-visible:ring-0 text-lg placeholder:text-gray-400"
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
  )

  const renderJournalSection = () => (
    <div className="flex flex-col h-full">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-t-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6" />
            <h2 className="text-xl font-bold">My Journal</h2>
          </div>
          <Button
            onClick={handleNewEntry}
            variant="outline"
            size="sm"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <PenTool className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>
        <p className="text-blue-100">Your wellness journey, automatically captured and manually crafted</p>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800">
        <div className="p-6 border-b dark:border-gray-700 tutorial-journal-filters">
          <JournalFilters entries={journalEntries} onFilteredEntriesChange={setFilteredEntries} />
        </div>

        <ScrollArea className="h-full p-6">
          {journalEntries.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3 dark:text-white">Your journal awaits</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed dark:text-gray-300">
                Start a conversation for automatic entries, or create your own manual journal entries to track your
                wellness journey.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setActiveSection("chat")}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Start Chatting
                </Button>
                <Button
                  onClick={handleNewEntry}
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <PenTool className="h-4 w-4 mr-2" />
                  Write Entry
                </Button>
              </div>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No entries match your filters</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredEntries.map((entry, index) => (
                <Card
                  key={entry.id}
                  className="border-l-4 border-l-purple-400 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-white to-purple-50 group dark:from-gray-700 dark:to-gray-600 dark:border-gray-600"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {entry.conversationId && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                            Auto-generated
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {entry.mood && (
                          <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
                            {entry.mood}
                          </Badge>
                        )}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditEntry(entry)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteClick(entry.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap dark:text-gray-200">
                      {entry.content}
                    </p>

                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )

  const renderSettingsSection = () => (
    <div className="flex flex-col h-full">
      <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white p-6 rounded-t-xl">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-6 w-6" />
          <h2 className="text-xl font-bold">Settings</h2>
        </div>
        <p className="text-gray-300">Customize your wellness companion</p>
      </div>

      <div className="flex-1 bg-white p-6 dark:bg-gray-800">
        <div className="space-y-6">
          {/* TODO: Uncomment this when we have a tutorial
          <Card className="p-6 dark:bg-gray-700 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-white">Tutorial & Help</h3>
            <p className="text-gray-600 mb-4 dark:text-gray-300">
              Need a refresher on how to use your wellness companion? Restart the tutorial anytime.
            </p>
            <Button
              onClick={() => setShowTutorial(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Restart Tutorial
            </Button>
          </Card> */}

          <Card className="p-6 dark:bg-gray-700 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-white">Data & Privacy</h3>
            <p className="text-gray-600 mb-4 dark:text-gray-300">
              Your conversations and journal entries are stored locally on your device for privacy.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                if (confirm("Are you sure you want to clear all your data? This cannot be undone.")) {
                  localStorage.removeItem("wellness-journal")
                  setJournalEntries([])
                  setMessages([])
                }
              }}
            >
              Clear All Data
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderActiveSection = () => {
    switch (activeSection) {
      case "home":
        return renderHomeSection()
      case "chat":
        return renderChatSection()
      case "journal":
        return renderJournalSection()
      case "settings":
        return renderSettingsSection()
      default:
        return renderHomeSection()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Fixed Sidebar Navigation */}
      <div
        className={`tutorial-sidebar fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out ${
          sidebarHovered || sidebarOpen ? "w-64" : "w-16"
        } ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        <div className="h-full bg-white/95 backdrop-blur-sm border-r border-purple-200 shadow-lg dark:bg-gray-800/95 dark:border-gray-700">
          {/* Logo Section */}
          <div className="p-4 border-b border-purple-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <Sparkles className="h-2 w-2 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
              </div>
              {(sidebarHovered || sidebarOpen) && (
                <div className="overflow-hidden">
                  <h1 className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap">
                    Wellness Companion
                  </h1>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <div className="p-3 space-y-1">
            {navigationItems.map((item) => (
              <div key={item.id} className="relative">
                <Button
                  variant="ghost"
                  className={`tutorial-nav-${item.id} w-full justify-start h-10 transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
                      : "hover:bg-purple-50 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                  } ${!(sidebarHovered || sidebarOpen) ? "px-3" : "px-4"}`}
                  onClick={() => {
                    setActiveSection(item.id)
                    setSidebarOpen(false)
                  }}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {(sidebarHovered || sidebarOpen) && (
                    <span className="ml-3 whitespace-nowrap overflow-hidden">{item.label}</span>
                  )}
                  {item.badge && (sidebarHovered || sidebarOpen) && (
                    <Badge variant="secondary" className="ml-auto bg-purple-100 text-purple-700 text-xs dark:bg-purple-900 dark:text-purple-100">
                      {item.badge > 99 ? "99+" : item.badge}
                    </Badge>
                  )}
                  {item.badge && !(sidebarHovered || sidebarOpen) && item.badge > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{item.badge > 9 ? "9+" : item.badge}</span>
                    </div>
                  )}
                </Button>
              </div>
            ))}
          </div>

          {/* Close button for mobile */}
          <div className="lg:hidden absolute top-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Bottom disclaimer - only show when expanded */}
          {(sidebarHovered || sidebarOpen) && (
            <div className="absolute bottom-4 left-2 right-2">
              <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg dark:from-amber-900/50 dark:to-orange-900/50 dark:border-amber-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-3 w-3 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-amber-800 dark:text-amber-200">
                    <p className="font-medium mb-1">Supportive companion</p>
                    <p>Not professional therapy.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Header with left margin for sidebar */}
      <div className="lg:ml-16">
        <AppHeader
          onLoginClick={() => setShowAuthModal(true)}
          onPricingClick={() => setShowPricingModal(true)}
          onMenuClick={() => setSidebarOpen(true)}
          isAuthenticated={isAuthenticated}
          userEmail={userEmail}
          isPremium={isPremium}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
      </div>

      {/* Main Content with left margin for sidebar */}
      <div className="lg:ml-16">
        <div className="container mx-auto p-4 max-w-7xl">
          <Card className="min-h-[calc(100vh-8rem)] shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden dark:bg-gray-800/90 dark:border-gray-700">
            {renderActiveSection()}
          </Card>
        </div>
      </div>

      {/* Interactive Tutorial */}
      <InteractiveTutorial
        isActive={showTutorial}
        onComplete={handleTutorialComplete}
        onSectionChange={setActiveSection}
        currentSection={activeSection}
      />

      <JournalEntryModal
        isOpen={showJournalModal}
        onClose={() => setShowJournalModal(false)}
        entry={editingEntry}
        onSave={handleSaveJournalEntry}
      />

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        itemName="this journal entry"
      />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onAuthenticated={handleAuthenticated} />

      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} onUpgrade={handleUpgrade} />
    </div>
  )
}
