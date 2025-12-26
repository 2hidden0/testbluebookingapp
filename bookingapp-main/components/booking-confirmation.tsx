"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Calendar, Clock, User, Mail, Phone, Sparkles, ChevronDown, Car } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { MobileCalendarSheet } from "@/components/mobile-calendar-sheet"
import { createCalendarURL, generateICS, openCalendarApp } from "@/lib/calendar-utils"

interface BookingConfirmationProps {
  service: string
  vehicleType?: string
  year?: number | null
  make?: string
  model?: string
  date: Date | undefined
  time: string
  contact: { name: string; email: string; phone: string }
  addons?: string[]
  onNewBooking: () => void
}

export function BookingConfirmation({
  service,
  vehicleType,
  year,
  make,
  model,
  date,
  time,
  contact,
  addons = [],
  onNewBooking,
}: BookingConfirmationProps) {
  const [showCalendarOptions, setShowCalendarOptions] = useState(false)
  const isMobile = useIsMobile()
  const [showMobileSheet, setShowMobileSheet] = useState(false)

  const formatDate = (date: Date | undefined) => {
    if (!date) return ""
    return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  }

  const getEventDates = () => {
    if (!date || !time) return { start: new Date(), end: new Date() }

    const [timePart, period] = time.split(" ")
    const [hours, minutes] = timePart.split(":").map(Number)
    let hour24 = hours
    if (period === "PM" && hours !== 12) hour24 += 12
    if (period === "AM" && hours === 12) hour24 = 0

    const start = new Date(date)
    start.setHours(hour24, minutes, 0, 0)

    const end = new Date(start)
    end.setHours(end.getHours() + 1) // 1 hour appointment

    return { start, end }
  }

  const getEventData = () => {
    const { start, end } = getEventDates()
    const vehicleInfo = `${year || ""} ${make || ""} ${model || ""}`.trim()
    const vehicleTypeLabel = vehicleType
      ? vehicleType
          .replace(/([A-Z])/g, " $1")
          .trim()
          .toUpperCase()
      : ""
    const vehicleText = vehicleTypeLabel ? `\nVehicle Type: ${vehicleTypeLabel}` : ""
    const vehicleDetailsText = vehicleInfo ? `\nVehicle: ${vehicleInfo}` : ""
    const addonsText = addons.length > 0 ? `\nAdd-ons: ${addons.join(", ")}` : ""

    return {
      title: `${service} Appointment`,
      description: `Service: ${service}${vehicleText}${vehicleDetailsText}${addonsText}\nBooked by: ${contact.name}\nPhone: ${contact.phone}\nEmail: ${contact.email}`,
      location: "Business Location",
      startDate: start,
      endDate: end,
    }
  }

  const generateICSFile = () => {
    const eventData = getEventData()
    const icsContent = generateICS(eventData)

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `appointment-${service.toLowerCase().replace(/\s+/g, "-")}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const openGoogleCalendar = () => {
    const eventData = getEventData()
    const url = createCalendarURL("google", eventData)
    window.open(url, "_blank")
  }

  const openOutlookCalendar = () => {
    const eventData = getEventData()
    const url = createCalendarURL("outlook", eventData)
    window.open(url, "_blank")
  }

  const openYahooCalendar = () => {
    const eventData = getEventData()
    const url = createCalendarURL("yahoo", eventData)
    window.open(url, "_blank")
  }

  const calendarOptions = [
    {
      name: "Apple Calendar",
      icon: "🍎",
      action: () => {
        if (isMobile) {
          const icsData = generateICS(getEventData())
          openCalendarApp("calshow:", icsData, () => {})
        } else {
          const url = createCalendarURL("icloud", getEventData())
          window.open(url, "_blank")
        }
      },
      description: "Opens in Calendar app",
    },
    { name: "Google Calendar", icon: "📅", action: openGoogleCalendar, description: "Opens in browser" },
    { name: "Outlook Calendar", icon: "📧", action: openOutlookCalendar, description: "Opens in browser" },
    {
      name: "Office 365",
      icon: "📆",
      action: () => {
        const eventData = getEventData()
        const url = createCalendarURL("office365", eventData)
        window.open(url, "_blank")
      },
      description: "Opens in browser",
    },
  ]

  const handleAddToCalendar = () => {
    if (isMobile) {
      setShowMobileSheet(true)
    } else {
      setShowCalendarOptions(!showCalendarOptions)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent">
          <CheckCircle2 className="h-8 w-8 text-accent-foreground" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-foreground">Booking Confirmed!</h2>
        <p className="mt-2 text-sm text-muted-foreground">{"We've sent a confirmation email to your inbox"}</p>
      </div>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-card-foreground">Appointment Details</h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Service</p>
              <p className="text-sm text-muted-foreground">{service}</p>
            </div>
          </div>

          {vehicleType && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <Car className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Vehicle Type</p>
                <p className="text-sm text-muted-foreground">
                  {vehicleType
                    .replace(/([A-Z])/g, " $1")
                    .trim()
                    .toUpperCase()}
                </p>
                {year && make && model && (
                  <p className="text-sm text-muted-foreground">
                    {year} {make} {model}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Date & Time</p>
              <p className="text-sm text-muted-foreground">{formatDate(date)}</p>
              <p className="text-sm text-muted-foreground">{time}</p>
            </div>
          </div>

          {addons.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Add-Ons</p>
                <p className="text-sm text-muted-foreground">{addons.join(", ")}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Name</p>
              <p className="text-sm text-muted-foreground">{contact.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Email</p>
              <p className="text-sm text-muted-foreground">{contact.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <Phone className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Phone</p>
              <p className="text-sm text-muted-foreground">{contact.phone}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <Button className="w-full h-12 text-base" onClick={onNewBooking}>
          Book Another Appointment
        </Button>

        <div className="relative">
          <Button
            variant="outline"
            className="w-full h-12 text-base bg-transparent justify-between"
            onClick={handleAddToCalendar}
          >
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Add to Calendar
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showCalendarOptions ? "rotate-180" : ""}`} />
          </Button>

          {!isMobile && showCalendarOptions && (
            <Card className="absolute top-full left-0 right-0 mt-2 p-3 z-10 bg-card border border-border shadow-xl">
              <div className="grid grid-cols-2 gap-2">
                {calendarOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => {
                      option.action()
                      setShowCalendarOptions(false)
                    }}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-muted/30 to-muted/50 hover:from-muted/60 hover:to-muted active:scale-95 transition-all border border-border/30"
                  >
                    <span className="text-3xl">{option.icon}</span>
                    <div className="text-center">
                      <p className="text-xs font-semibold text-foreground leading-tight">{option.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      <MobileCalendarSheet
        isOpen={showMobileSheet}
        onClose={() => setShowMobileSheet(false)}
        eventData={getEventData()}
      />

      <Card className="bg-muted p-4">
        <p className="text-sm text-muted-foreground text-center">
          Need to make changes? Contact us at <span className="font-medium text-foreground">(555) 123-4567</span>
        </p>
      </Card>
    </div>
  )
}
