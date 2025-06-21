"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { JournalEntryModal } from "@/components/journal-entry-modal"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { JournalFilters } from "@/components/journal-filters"
import { JournalCalendar } from "@/components/journal-calendar"
import { JournalDayView } from "@/components/journal-day-view"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/components/supabase-auth-provider"
import { createJournalEntry, deleteJournalEntry, getJournalEntries, updateJournalEntry } from "@/lib/journal"
import { JournalEntry } from "@/lib/types"
import {
  BookOpen,
  Edit3,
  Trash2,
  PenTool,
  Calendar,
  List,
} from "lucide-react"

export default function JournalPage() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([])
  const [showJournalModal, setShowJournalModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [showAuthModal, setShowAuthModal] = useState(false)

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

  const handleSaveJournalEntry = async (entry: JournalEntry) => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    try {
      if (editingEntry) {
        // Update existing entry
        const updatedEntry = await updateJournalEntry(entry.id, entry.content, entry.mood || "", entry.tags)

        if (updatedEntry) {
          setJournalEntries(prev => prev.map(e => e.id === entry.id ? updatedEntry : e))
        }
      } else {
        // Create new entry
        const newEntry = await createJournalEntry(user?.id || "", entry.content, entry.mood || "", entry.tags)

        if (newEntry) {
          setJournalEntries(prev => [newEntry, ...prev])
        }
      }
      
      setEditingEntry(null)
    } catch (error) {
      console.error('Failed to save journal entry:', error)
    }
  }

  const handleDeleteJournalEntry = async (entryId: string) => {
    try {
      const deletedEntry = await deleteJournalEntry(entryId)

      if (deletedEntry) {
        setJournalEntries(prev => prev.filter(entry => entry.id !== entryId))
      }
    } catch (error) {
      console.error('Failed to delete journal entry:', error)
    }
  }

  const handleEditEntry = (entry: JournalEntry) => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    setEditingEntry(entry)
    setShowJournalModal(true)
  }

  const handleNewEntry = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    setEditingEntry(null)
    setShowJournalModal(true)
  }

  const handleDeleteClick = (entryId: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    setEntryToDelete(entryId)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (entryToDelete) {
      handleDeleteJournalEntry(entryToDelete)
      setEntryToDelete(null)
    }
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  return (
    <main>
      <div className="container mx-auto p-4 max-w-7xl">
        <Card className="min-h-[calc(100vh-8rem)] shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden dark:bg-gray-800/90 dark:border-gray-700">
          <div className="flex flex-col h-full">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6" />
                  <h1 className="text-xl font-bold">My Journal</h1>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex bg-white/20 rounded-lg p-1">
                    <Button
                      onClick={() => setViewMode('calendar')}
                      variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                      size="sm"
                      className={`text-xs ${viewMode === 'calendar' ? 'bg-white text-purple-600' : 'text-white hover:bg-white/20'}`}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Calendar
                    </Button>
                    <Button
                      onClick={() => setViewMode('list')}
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      className={`text-xs ${viewMode === 'list' ? 'bg-white text-purple-600' : 'text-white hover:bg-white/20'}`}
                    >
                      <List className="h-4 w-4 mr-1" />
                      List
                    </Button>
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
              </div>
              <p className="text-blue-100">Your wellness journey, automatically captured and manually crafted</p>
            </div>

            <div className="flex-1 bg-white dark:bg-gray-800">
              {viewMode === 'calendar' ? (
                <div className="grid lg:grid-cols-3 gap-6 p-6">
                  {/* Calendar Section */}
                  <div className="lg:col-span-1">
                    <JournalCalendar
                      entries={journalEntries}
                      selectedDate={selectedDate}
                      onDateSelect={handleDateSelect}
                      isAuthenticated={isAuthenticated}
                    />
                  </div>
                  
                  {/* Day View Section */}
                  <div className="lg:col-span-2">
                    <JournalDayView
                      entries={journalEntries}
                      selectedDate={selectedDate}
                      onEditEntry={handleEditEntry}
                      onDeleteEntry={handleDeleteClick}
                      onNewEntry={handleNewEntry}
                      isAuthenticated={isAuthenticated}
                    />
                  </div>
                </div>
              ) : (
                /* List View */
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b dark:border-gray-700">
                    <JournalFilters entries={journalEntries} onFilteredEntriesChange={setFilteredEntries} />
                  </div>

                  <ScrollArea className="h-full p-6">
                    {journalEntries.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
                          <BookOpen className="h-12 w-12 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3 dark:text-white">Your journal awaits</h2>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed dark:text-gray-300">
                          Start a conversation for automatic entries, or create your own manual journal entries to track your
                          wellness journey.
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Button
                            onClick={() => window.location.href = '/chat'}
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
                        {filteredEntries.map((entry) => (
                          <Card
                            key={entry.id}
                            className="border-l-4 border-l-purple-400 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-white to-purple-50 group dark:from-gray-700 dark:to-gray-600 dark:border-gray-600"
                          >
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    {new Date(entry.created_at).toLocaleDateString("en-US", {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                  {entry.conversation_id && (
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
              )}
            </div>
          </div>
        </Card>
      </div>

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

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </main>
  )
} 