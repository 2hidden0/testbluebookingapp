"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { X, Calendar } from "lucide-react"
import { detectMobileOS, generateICS, openCalendarApp, createCalendarURL } from "@/lib/calendar-utils"

interface MobileCalendarSheetProps {
  isOpen: boolean
  onClose: () => void
  eventData: {
    title: string
    description: string
    location: string
    startDate: Date
    endDate: Date
  }
}

export function MobileCalendarSheet({ isOpen, onClose, eventData }: MobileCalendarSheetProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isiOS, setIsiOS] = useState(false)

  useEffect(() => {
    const { isMobile: mobile, iOS } = detectMobileOS()
    setIsMobile(mobile)
    setIsiOS(iOS)
  }, [])

  if (!isOpen || !isMobile) return null

  const icsData = generateICS(eventData)

  const calendarApps = [
    ...(isiOS ? [{ name: "Apple Calendar", icon: "🍎", scheme: "calshow:", type: "apple" }] : []),
    { name: "Google Calendar", icon: "📅", scheme: "google", type: "google" },
    { name: "Outlook Calendar", icon: "📧", scheme: "outlook", type: "outlook" },
    { name: "Office 365", icon: "📆", scheme: "office365", type: "office365" },
  ]

  const handleCalendarAction = (app: (typeof calendarApps)[0]) => {
    if (app.type === "apple") {
      openCalendarApp(app.scheme, icsData, () => {})
    } else if (app.type === "google") {
      const url = createCalendarURL("google", eventData)
      window.open(url, "_blank")
    } else if (app.type === "outlook") {
      const url = createCalendarURL("outlook", eventData)
      window.open(url, "_blank")
    } else if (app.type === "office365") {
      const url = createCalendarURL("office365", eventData)
      window.open(url, "_blank")
    }
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 animate-in fade-in" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
        <Card className="rounded-t-3xl border-t border-border bg-card p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
          {/* Handle bar */}
          <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-muted" />

          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                <Calendar className="h-5 w-5 text-accent-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-card-foreground">Add to Calendar</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {calendarApps.map((app) => (
              <button
                key={app.name}
                onClick={() => handleCalendarAction(app)}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted hover:from-muted hover:to-muted/80 active:scale-95 transition-all border border-border/50 shadow-sm"
              >
                <span className="text-5xl">{app.icon}</span>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">{app.name}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}
