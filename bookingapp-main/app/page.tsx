"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { ServiceSelection, services } from "@/components/service-selection"
import { DateTimeSelection } from "@/components/date-time-selection"
import { AddonsSelection } from "@/components/addons-selection"
import { ContactForm } from "@/components/contact-form"
import { BookingConfirmation } from "@/components/booking-confirmation"
import { InstallPrompt } from "@/components/install-prompt"
import { VehicleTypeSelection } from "@/components/vehicle-type-selection"
import { VehicleYMMSelection } from "@/components/vehicle-ymm-selection"

type Step = "service" | "vehicleType" | "vehicleYMM" | "addons" | "datetime" | "contact" | "confirmation"

export default function BookingApp() {
  const [step, setStep] = useState<Step>("service")
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedMake, setSelectedMake] = useState<string>("")
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [contactInfo, setContactInfo] = useState({ name: "", email: "", phone: "" })

  const serviceHasAddons = () => {
    const service = services.find((s) => s.name === selectedService)
    return service?.hasAddons ?? false
  }

  const handleServiceSelect = (service: string) => {
    setSelectedService(service)
    setStep("vehicleType")
  }

  const handleVehicleTypeSelect = (vehicleType: string) => {
    setSelectedVehicleType(vehicleType)
    setStep("vehicleYMM")
  }

  const handleVehicleYMMSelect = (year: number, make: string, model: string) => {
    setSelectedYear(year)
    setSelectedMake(make)
    setSelectedModel(model)
    const selectedServiceObj = services.find((s) => s.name === selectedService)
    if (selectedServiceObj?.hasAddons) {
      setStep("addons")
    } else {
      setStep("datetime")
    }
  }

  const handleAddonsSelect = (addons: string[]) => {
    setSelectedAddons(addons)
    setStep("datetime")
  }

  const handleDateTimeSelect = (date: Date | undefined, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
    setStep("contact")
  }

  const handleContactSubmit = (info: { name: string; email: string; phone: string }) => {
    setContactInfo(info)
    setStep("confirmation")
  }

  const handleNewBooking = () => {
    setStep("service")
    setSelectedVehicleType("")
    setSelectedYear(null)
    setSelectedMake("")
    setSelectedModel("")
    setSelectedService("")
    setSelectedDate(undefined)
    setSelectedTime("")
    setSelectedAddons([])
    setContactInfo({ name: "", email: "", phone: "" })
  }

  const getTotalSteps = () => (serviceHasAddons() ? 6 : 5)
  const getCurrentStepNumber = () => {
    if (step === "service") return 1
    if (step === "vehicleType") return 2
    if (step === "vehicleYMM") return 3
    if (step === "addons") return 4
    if (step === "datetime") return serviceHasAddons() ? 5 : 4
    if (step === "contact") return serviceHasAddons() ? 6 : 5
    return 0
  }

  return (
    <main className="min-h-screen bg-[rgba(0,0,0,1)]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary px-4 py-6 shadow-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-popover-foreground">Book Now</h1>
              <p className="text-xs text-popover-foreground">Professional Services</p>
            </div>
          </div>
        </div>
      </header>

      {step !== "confirmation" && (
        <div className="px-4 py-4 bg-[rgba(0,0,0,1)]">
          <div className="mx-auto max-w-lg">
            <div className="flex items-center justify-between">
              {/* Step 1: Service */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                    step === "service" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                  }`}
                >
                  1
                </div>
                <span className="mt-1 text-xs text-muted-foreground">Service</span>
              </div>
              <div className={`h-[2px] flex-1 ${step === "service" ? "bg-border" : "bg-primary"}`} />

              {/* Step 2: Vehicle Type */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                    step === "vehicleType"
                      ? "bg-accent text-accent-foreground"
                      : step === "service"
                        ? "bg-muted-foreground/20 text-muted-foreground"
                        : "bg-primary text-primary-foreground"
                  }`}
                >
                  2
                </div>
                <span className="mt-1 text-xs text-muted-foreground">Vehicle</span>
              </div>
              <div
                className={`h-[2px] flex-1 ${step === "service" || step === "vehicleType" ? "bg-border" : "bg-primary"}`}
              />

              {/* Step 3: Vehicle YMM */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                    step === "vehicleYMM"
                      ? "bg-accent text-accent-foreground"
                      : step === "service" || step === "vehicleType"
                        ? "bg-muted-foreground/20 text-muted-foreground"
                        : "bg-primary text-primary-foreground"
                  }`}
                >
                  3
                </div>
                <span className="mt-1 text-xs text-muted-foreground">Details</span>
              </div>
              <div
                className={`h-[2px] flex-1 ${
                  step === "service" || step === "vehicleType" || step === "vehicleYMM" ? "bg-border" : "bg-primary"
                }`}
              />

              {serviceHasAddons() || step === "addons" ? (
                <>
                  {/* Step 4: Add-ons */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                        step === "addons"
                          ? "bg-accent text-accent-foreground"
                          : step === "service" || step === "vehicleType" || step === "vehicleYMM"
                            ? "bg-muted-foreground/20 text-muted-foreground"
                            : "bg-primary text-primary-foreground"
                      }`}
                    >
                      4
                    </div>
                    <span className="mt-1 text-xs text-muted-foreground">Add-ons</span>
                  </div>
                  <div
                    className={`h-[2px] flex-1 ${
                      step === "service" || step === "vehicleType" || step === "vehicleYMM" || step === "addons"
                        ? "bg-border"
                        : "bg-primary"
                    }`}
                  />
                  {/* Step 5: Date */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                        step === "datetime"
                          ? "bg-accent text-accent-foreground"
                          : step === "contact"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted-foreground/20 text-muted-foreground"
                      }`}
                    >
                      5
                    </div>
                    <span className="mt-1 text-xs text-muted-foreground">Date</span>
                  </div>
                  <div className={`h-[2px] flex-1 ${step === "contact" ? "bg-primary" : "bg-border"}`} />
                  {/* Step 6: Contact */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                        step === "contact"
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted-foreground/20 text-muted-foreground"
                      }`}
                    >
                      6
                    </div>
                    <span className="mt-1 text-xs text-muted-foreground">Contact</span>
                  </div>
                </>
              ) : (
                <>
                  {/* Step 4: Date (no add-ons) */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                        step === "datetime"
                          ? "bg-accent text-accent-foreground"
                          : step === "service" || step === "vehicleType" || step === "vehicleYMM"
                            ? "bg-muted-foreground/20 text-muted-foreground"
                            : "bg-primary text-primary-foreground"
                      }`}
                    >
                      4
                    </div>
                    <span className="mt-1 text-xs text-muted-foreground">Date</span>
                  </div>
                  <div
                    className={`h-[2px] flex-1 ${
                      step === "service" || step === "vehicleType" || step === "vehicleYMM" || step === "datetime"
                        ? "bg-border"
                        : "bg-primary"
                    }`}
                  />
                  {/* Step 5: Contact */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                        step === "contact"
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted-foreground/20 text-muted-foreground"
                      }`}
                    >
                      5
                    </div>
                    <span className="mt-1 text-xs text-muted-foreground">Contact</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-lg px-4 py-6">
        {step === "service" && <ServiceSelection onSelect={handleServiceSelect} />}
        {step === "vehicleType" && (
          <VehicleTypeSelection onSelect={handleVehicleTypeSelect} onBack={() => setStep("service")} />
        )}
        {step === "vehicleYMM" && (
          <VehicleYMMSelection
            vehicleType={selectedVehicleType}
            onSelect={handleVehicleYMMSelect}
            onBack={() => setStep("vehicleType")}
          />
        )}
        {step === "addons" && <AddonsSelection onContinue={handleAddonsSelect} onBack={() => setStep("vehicleYMM")} />}
        {step === "datetime" && (
          <DateTimeSelection
            onSelect={handleDateTimeSelect}
            onBack={() => setStep(serviceHasAddons() ? "addons" : "vehicleYMM")}
          />
        )}
        {step === "contact" && (
          <ContactForm
            selectedService={selectedService}
            selectedVehicleType={selectedVehicleType}
            selectedYear={selectedYear}
            selectedMake={selectedMake}
            selectedModel={selectedModel}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedAddons={selectedAddons}
            onSubmit={handleContactSubmit}
            onBack={() => setStep("datetime")}
          />
        )}
        {step === "confirmation" && (
          <BookingConfirmation
            service={selectedService}
            vehicleType={selectedVehicleType}
            year={selectedYear}
            make={selectedMake}
            model={selectedModel}
            date={selectedDate}
            time={selectedTime}
            contact={contactInfo}
            addons={selectedAddons}
            onNewBooking={handleNewBooking}
          />
        )}
      </div>

      {/* Install Prompt */}
      <InstallPrompt />
    </main>
  )
}
