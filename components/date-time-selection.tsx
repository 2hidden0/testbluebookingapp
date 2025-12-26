"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
]

interface DateTimeSelectionProps {
  onSelect: (date: Date | undefined, time: string) => void
  onBack: () => void
}

export function DateTimeSelection({ onSelect, onBack }: DateTimeSelectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek }
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => i)

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(date)
    setSelectedTime("")
  }

  const handleTimeClick = (time: string) => {
    setSelectedTime(time)
  }

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onSelect(selectedDate, selectedTime)
    }
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-semibold text-foreground">Select Date & Time</h2>
        <div className="w-10" />
      </div>

      {/* Calendar */}
      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-base font-semibold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={i} className="text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          {emptyDays.map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map((day) => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
            const isSelected =
              selectedDate?.getDate() === day &&
              selectedDate?.getMonth() === currentMonth.getMonth() &&
              selectedDate?.getFullYear() === currentMonth.getFullYear()
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))

            return (
              <button
                key={day}
                onClick={() => !isPast && handleDateClick(day)}
                disabled={isPast}
                className={`aspect-square rounded-md text-sm transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold"
                    : isPast
                      ? "text-muted-foreground/30 cursor-not-allowed"
                      : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </Card>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-foreground">Available Times</h3>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                className="h-12"
                onClick={() => handleTimeClick(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <Button className="w-full h-12 text-base" disabled={!selectedDate || !selectedTime} onClick={handleContinue}>
        Continue to Contact Info
      </Button>
    </div>
  )
}
