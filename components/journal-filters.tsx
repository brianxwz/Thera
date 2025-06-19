"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, SortAsc, Calendar, Tag, Heart, X, ChevronDown, ChevronUp } from "lucide-react"
import { JournalEntry } from "@/lib/types"

interface JournalFiltersProps {
  entries: JournalEntry[]
  onFilteredEntriesChange: (entries: JournalEntry[]) => void
}

// Custom hook for debounced value
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function JournalFilters({ entries, onFilteredEntriesChange }: JournalFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMood, setSelectedMood] = useState<string>("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>("newest")
  const [dateRange, setDateRange] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  // Debounce search term to improve performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Memoize unique moods and tags to avoid recalculation
  const { allMoods, allTags } = useMemo(() => {
    const moods = Array.from(new Set(entries.map((entry) => entry.mood).filter(Boolean)))
    const tags = Array.from(new Set(entries.flatMap((entry) => entry.tags)))
    return { allMoods: moods, allTags: tags }
  }, [entries])

  // Memoize the filtering logic for better performance
  const filteredEntries = useMemo(() => {
    let filtered = [...entries]

    // Search filter
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase()
      filtered = filtered.filter(
        (entry) =>
          entry.content.toLowerCase().includes(searchLower) ||
          entry.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    // Mood filter
    if (selectedMood !== "all") {
      filtered = filtered.filter((entry) => entry.mood === selectedMood)
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((entry) => selectedTags.some((tag) => entry.tags.includes(tag)))
    }

    // Date range filter
    if (dateRange !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (dateRange) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          break
        case "3months":
          filterDate.setMonth(now.getMonth() - 3)
          break
      }

      if (dateRange !== "all") {
        filtered = filtered.filter((entry) => new Date(entry.created_at) >= filterDate)
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "longest":
          return b.content.length - a.content.length
        case "shortest":
          return a.content.length - b.content.length
        default:
          return 0
      }
    })

    return filtered
  }, [entries, debouncedSearchTerm, selectedMood, selectedTags, sortBy, dateRange])

  // Update parent component when filtered entries change
  useEffect(() => {
    onFilteredEntriesChange(filteredEntries)
  }, [filteredEntries, onFilteredEntriesChange])

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }, [])

  const clearAllFilters = useCallback(() => {
    setSearchTerm("")
    setSelectedMood("all")
    setSelectedTags([])
    setSortBy("newest")
    setDateRange("all")
  }, [])

  const hasActiveFilters =
    debouncedSearchTerm ||
    selectedMood !== "all" ||
    selectedTags.length > 0 ||
    dateRange !== "all" ||
    sortBy !== "newest"

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search your journal entries..."
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700">
              Active
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Sort */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <SortAsc className="h-4 w-4" />
                  Sort by
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="longest">Longest entries</SelectItem>
                    <SelectItem value="shortest">Shortest entries</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date range
                </label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Past week</SelectItem>
                    <SelectItem value="month">Past month</SelectItem>
                    <SelectItem value="3months">Past 3 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mood Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Mood
                </label>
                <Select value={selectedMood} onValueChange={setSelectedMood}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All moods</SelectItem>
                    {allMoods.map((mood) => (
                      <SelectItem key={mood} value={mood!}>
                        {mood}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Entry Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Entry type
                </label>
                <Select value="all" onValueChange={() => {}}>
                  <SelectTrigger>
                    <SelectValue placeholder="All entries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All entries</SelectItem>
                    <SelectItem value="auto">Auto-generated</SelectItem>
                    <SelectItem value="manual">Manual entries</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Filter by tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-purple-500 text-white"
                          : "hover:bg-purple-100 text-purple-700 border-purple-200"
                      }`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="pt-2 border-t border-purple-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Active filters:</span>
                  {debouncedSearchTerm && (
                    <Badge variant="outline" className="text-xs">
                      Search: "{debouncedSearchTerm}"
                    </Badge>
                  )}
                  {selectedMood !== "all" && (
                    <Badge variant="outline" className="text-xs">
                      Mood: {selectedMood}
                    </Badge>
                  )}
                  {selectedTags.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      Tags: {selectedTags.length}
                    </Badge>
                  )}
                  {dateRange !== "all" && (
                    <Badge variant="outline" className="text-xs">
                      Date: {dateRange}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
