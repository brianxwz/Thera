"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/components/supabase-auth-provider"
import { deleteJournalEntry, getJournalEntries } from "@/lib/journal"
import { JournalEntry } from "@/lib/types"
import {
  Settings,
} from "lucide-react"

export default function SettingsPage() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [isDarkMode, setIsDarkMode] = useState(true) // Default to dark mode

  const { user, isAuthenticated } = useAuth()

  // Fetch journal entries for data management
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

  React.useEffect(() => {
    fetchJournalEntries()
  }, [])

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  return (
    <main>
      <div className="container mx-auto p-4 max-w-7xl">
        <Card className="min-h-[calc(100vh-8rem)] shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden dark:bg-gray-800/90 dark:border-gray-700">
          <div className="flex flex-col h-full">
            <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white p-6">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="h-6 w-6" />
                <h1 className="text-xl font-bold">Settings</h1>
              </div>
              <p className="text-gray-300">Customize your wellness companion</p>
            </div>

            <div className="flex-1 bg-white p-6 dark:bg-gray-800">
              <div className="space-y-6">
                <Card className="p-6 dark:bg-gray-700 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-white">Data & Privacy</h3>
                  <p className="text-gray-600 mb-4 dark:text-gray-300">
                    Your conversations and journal entries are stored securely in the database and synced across devices.
                  </p>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      if (confirm("Are you sure you want to clear all your data? This cannot be undone.")) {
                        try {
                          // Delete all entries from database
                          for (const entry of journalEntries) {
                            await deleteJournalEntry(entry.id)
                          }
                          setJournalEntries([])
                          // Clear chat messages from localStorage if they exist
                          localStorage.removeItem('ai-sdk-chat-history')
                        } catch (error) {
                          console.error('Failed to clear data:', error)
                        }
                      }
                    }}
                  >
                    Clear All Data
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
} 