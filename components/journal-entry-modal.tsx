"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Heart, Save, X, Plus } from "lucide-react"
import { JournalEntry } from "@/lib/types"

interface MoodOption {
  emoji: string
  label: string
  color: string
}

interface JournalEntryModalProps {
  isOpen: boolean
  onClose: () => void
  entry?: JournalEntry | null
  onSave: (entry: JournalEntry) => void
}

export function JournalEntryModal({ isOpen, onClose, entry, onSave }: JournalEntryModalProps) {
  const [content, setContent] = useState("")
  const [mood, setMood] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [id, setId] = useState("")

  const moodOptions: MoodOption[] = [
    { emoji: "😊", label: "Great", color: "bg-green-100 text-green-700 hover:bg-green-200" },
    { emoji: "🙂", label: "Good", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
    { emoji: "😐", label: "Okay", color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
    { emoji: "😔", label: "Low", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
    { emoji: "😰", label: "Anxious", color: "bg-orange-100 text-orange-700 hover:bg-orange-200" },
    { emoji: "🙏", label: "Grateful", color: "bg-pink-100 text-pink-700 hover:bg-pink-200" },
    { emoji: "😴", label: "Tired", color: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
    { emoji: "💪", label: "Motivated", color: "bg-red-100 text-red-700 hover:bg-red-200" },
    { emoji: "🤔", label: "Thoughtful", color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" },
    { emoji: "😌", label: "Peaceful", color: "bg-teal-100 text-teal-700 hover:bg-teal-200" },
  ]

  useEffect(() => {
    if (entry) {
      // Editing existing entry
      setContent(entry.content)
      setMood(entry.mood || "")
      setTags(entry.tags || [])
      setId(entry.id)
    } else {
      // Creating new entry
      setContent("")
      setMood("")
      setTags([])
    }
  }, [entry, isOpen])

  const handleSave = () => {
    if (!content.trim()) return

    const newEntry: JournalEntry = {
      id: id,
      user_id: "",
      content: content,
      mood: mood,
      tags: tags,
      conversation_id: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    onSave(newEntry)
    handleClose()
  }

  const handleClose = () => {
    setContent("")
    setMood("")
    setTags([])
    setNewTag("")
    onClose()
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
      setTags([...tags, newTag.trim().toLowerCase()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleMoodSelect = (selectedMood: MoodOption) => {
    setMood(`${selectedMood.emoji} ${selectedMood.label}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl">
                  {entry ? "Edit Journal Entry" : "Create New Journal Entry"}
                </DialogTitle>
                <DialogDescription>
                  {entry ? "Make changes to your journal entry" : "Write about your thoughts and feelings"}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mood Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">How are you feeling?</Label>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map((moodOption) => (
                <Button
                  key={moodOption.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  className={`h-16 flex flex-col gap-1 transition-all duration-200 ${
                    mood === `${moodOption.emoji} ${moodOption.label}`
                      ? `${moodOption.color} border-2 shadow-md`
                      : "hover:shadow-md"
                  }`}
                  onClick={() => handleMoodSelect(moodOption)}
                >
                  <span className="text-xl">{moodOption.emoji}</span>
                  <span className="text-xs font-medium">{moodOption.label}</span>
                </Button>
              ))}
            </div>
            {mood && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Selected mood:</span>
                <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
                  {mood}
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium text-gray-700">
              Your thoughts and feelings
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write about what's on your mind, how you're feeling, what happened today, or any insights you've had..."
              className="min-h-[200px] resize-none"
              maxLength={2000}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Express yourself freely - this is your safe space</span>
              <span>{content.length}/2000</span>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Tags (optional)</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag (e.g., work, family, anxiety)"
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200 cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    #{tag} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!content.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {entry ? "Save Changes" : "Create Entry"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
