"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { JournalEntry } from "@/lib/types"
import { Edit3, Trash2, Clock, Calendar, Lock } from "lucide-react"

interface JournalDayViewProps {
  entries: JournalEntry[]
  selectedDate: Date
  onEditEntry: (entry: JournalEntry) => void
  onDeleteEntry: (entryId: string) => void
  onNewEntry: () => void
  isAuthenticated?: boolean
}

export function JournalDayView({ 
  entries, 
  selectedDate, 
  onEditEntry, 
  onDeleteEntry, 
  onNewEntry,
  isAuthenticated = true
}: JournalDayViewProps) {
  // Filter entries for the selected date
  const dayEntries = entries.filter(entry => {
    const entryDate = new Date(entry.created_at)
    return entryDate.toDateString() === selectedDate.toDateString()
  })

  const isToday = selectedDate.toDateString() === new Date().toDateString()
  const isPast = selectedDate < new Date(new Date().setHours(0, 0, 0, 0))

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    })
  }

  const getDateDisplay = () => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (selectedDate.toDateString() === today.toDateString()) {
      return "Today"
    } else if (selectedDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    }
  }

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 dark:border-gray-700">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {getDateDisplay()}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {dayEntries.length} {dayEntries.length === 1 ? 'entry' : 'entries'}
              </p>
            </div>
          </div>
        </div>

        {/* Authentication Notice */}
        {!isAuthenticated && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-900/20 dark:border-amber-800">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">Sign in to create and manage journal entries</span>
            </div>
          </div>
        )}

        {/* Entries */}
        {dayEntries.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2 dark:text-white">
              No entries for {isToday ? 'today' : 'this day'}
            </h4>
            <p className="text-gray-600 mb-4 dark:text-gray-300">
              {isToday 
                ? "Start your day with a journal entry to track your thoughts and feelings."
                : isPast
                ? "No entries were recorded for this day."
                : "Visit again on this day to add an entry."
              }
            </p>
            {isToday && <Button
              onClick={onNewEntry}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/20"
            >
              {isAuthenticated ? "Write Entry" : "Sign In to Write"}
            </Button>}
          </div>
        ) : (
          <div className="space-y-4">
            {dayEntries
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((entry) => (
                <Card
                  key={entry.id}
                  className="border-l-4 border-l-purple-400 shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-purple-50 group dark:from-gray-700 dark:to-gray-600 dark:border-gray-600"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3" />
                          {formatTime(entry.created_at)}
                        </div>
                        {entry.conversation_id && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700">
                            Auto-generated
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {entry.mood && (
                          <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 dark:from-purple-900/30 dark:to-pink-900/30 dark:text-purple-300 dark:border-purple-600">
                            {entry.mood}
                          </Badge>
                        )}
                        {isAuthenticated && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onEditEntry(entry)}
                              className="h-7 w-7 p-0"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onDeleteEntry(entry.id)}
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-3 whitespace-pre-wrap dark:text-gray-200">
                      {entry.content}
                    </p>

                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200 dark:from-blue-900/20 dark:to-purple-900/20 dark:text-blue-300 dark:border-blue-600"
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
      </CardContent>
    </Card>
  )
} 