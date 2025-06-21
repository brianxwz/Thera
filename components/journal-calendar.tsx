"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { JournalEntry } from "@/lib/types"
import { ChevronLeft, ChevronRight, Calendar, Lock } from "lucide-react"

interface JournalCalendarProps {
  entries: JournalEntry[]
  selectedDate: Date
  onDateSelect: (date: Date) => void
  isAuthenticated?: boolean
}

export function JournalCalendar({ entries, selectedDate, onDateSelect, isAuthenticated = true }: JournalCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Group entries by date
  const entriesByDate = useMemo(() => {
    const grouped: Record<string, JournalEntry[]> = {}
    entries.forEach(entry => {
      const dateKey = new Date(entry.created_at).toDateString()
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(entry)
    })
    return grouped
  }, [entries])

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const currentDate = new Date(startDate)

    while (currentDate <= lastDay || currentDate.getDay() !== 0) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return days
  }, [currentMonth])

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1))
    onDateSelect(today)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString()
  }

  const hasEntries = (date: Date) => {
    return entriesByDate[date.toDateString()]?.length > 0
  }

  const getEntryCount = (date: Date) => {
    return entriesByDate[date.toDateString()]?.length || 0
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth()
  }

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 dark:border-gray-700">
      <CardContent className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Calendar View</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={goToToday}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Today
            </Button>
          </div>
        </div>

        {/* Authentication Notice */}
        {!isAuthenticated && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-900/20 dark:border-amber-800">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">Sign in to create journal entries</span>
            </div>
          </div>
        )}

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={goToPreviousMonth}
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
            {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h4>
          <Button
            onClick={goToNextMonth}
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div
              key={day}
              className="h-8 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const dayEntries = getEntryCount(date)
            const isTodayDate = isToday(date)
            const isSelectedDate = isSelected(date)
            const hasEntriesForDay = hasEntries(date)
            const isCurrentMonthDate = isCurrentMonth(date)

            return (
              <button
                key={index}
                onClick={() => onDateSelect(date)}
                className={`
                  h-12 relative flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200
                  ${isCurrentMonthDate 
                    ? 'text-gray-800 dark:text-white' 
                    : 'text-gray-400 dark:text-gray-500'
                  }
                  ${isTodayDate 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : ''
                  }
                  ${isSelectedDate && !isTodayDate
                    ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-300 dark:border-purple-600'
                    : ''
                  }
                  ${!isTodayDate && !isSelectedDate && isCurrentMonthDate
                    ? 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    : ''
                  }
                `}
              >
                <span>{date.getDate()}</span>
                {hasEntriesForDay && (
                  <div className="absolute -bottom-1 -right-1">
                    <Badge 
                      variant="secondary" 
                      className="h-4 w-4 p-0 text-xs bg-green-500 text-white border-0"
                    >
                      {dayEntries > 9 ? '9+' : dayEntries}
                    </Badge>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600 dark:text-gray-300">Has entries</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-xs text-gray-600 dark:text-gray-300">Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 