"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Loader2, AlertCircle } from "lucide-react"

interface ContactFormProps {
  selectedService: string
  selectedVehicleType?: string
  selectedYear?: number | null
  selectedMake?: string
  selectedModel?: string
  selectedDate: Date | undefined
  selectedTime: string
  selectedAddons?: string[]
  onSubmit: (info: { name: string; email: string; phone: string; notes?: string }) => void
  onBack: () => void
}

export function ContactForm({
  selectedService,
  selectedVehicleType,
  selectedYear,
  selectedMake,
  selectedModel,
  selectedDate,
  selectedTime,
  selectedAddons = [],
  onSubmit,
  onBack,
}: ContactFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const vehicleTypeLabel = selectedVehicleType
      ? selectedVehicleType
          .toUpperCase()
          .replace(/([A-Z])/g, " $1")
          .trim()
      : "Not specified"

    const bookingData = {
      name,
      email,
      phone,
      service: selectedService,
      vehicleType: vehicleTypeLabel,
      vehicle: `${selectedYear || ""} ${selectedMake || ""} ${selectedModel || ""}`.trim(),
      date: selectedDate?.toLocaleDateString() || "",
      time: selectedTime,
      addons: selectedAddons.length > 0 ? selectedAddons.join(", ") : "None",
      notes: notes || "No additional notes",
      _subject: `New Booking: ${selectedService}`,
      _template: "table",
      _captcha: "false",
    }

    try {
      const response = await fetch("https://formsubmit.co/ajax/harmangidda@icloud.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      const result = await response.json()

      if (result.success) {
        onSubmit({ name, email, phone, notes })
      } else {
        setError("Failed to submit booking. Please try again.")
      }
    } catch (err) {
      console.error("Booking submission error:", err)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid = name.trim() && email.trim() && phone.trim()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onBack} disabled={isSubmitting}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-semibold text-foreground">Your Information</h2>
        <div className="w-10" />
      </div>

      {selectedAddons.length > 0 && (
        <Card className="bg-primary/5 border-primary/20 p-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Selected add-ons:</span> {selectedAddons.join(", ")}
          </p>
        </Card>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <Input
              id="vehicleType"
              type="text"
              placeholder="Sedan"
              value={selectedVehicleType || ""}
              readOnly
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicle">Vehicle Details</Label>
            <Input
              id="vehicle"
              type="text"
              placeholder="Year Make Model"
              value={`${selectedYear || ""} ${selectedMake || ""} ${selectedModel || ""}`.trim()}
              readOnly
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special requests or information we should know..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] text-base"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full h-12 text-base" disabled={!isValid || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </form>
      </Card>

      <Card className="border-amber-500/50 bg-amber-500/10 p-4">
        <p className="text-sm text-muted-foreground">
          <strong>First time booking?</strong> Please check your email inbox for a confirmation message after
          submitting.
        </p>
      </Card>
    </div>
  )
}
