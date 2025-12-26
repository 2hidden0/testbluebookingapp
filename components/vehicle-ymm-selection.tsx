"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { vehicleData } from "@/lib/vehicle-data"

interface VehicleYMMSelectionProps {
  vehicleType: string
  onSelect: (year: number, make: string, model: string) => void
  onBack: () => void
}

export function VehicleYMMSelection({ vehicleType, onSelect, onBack }: VehicleYMMSelectionProps) {
  const [step, setStep] = useState<"year" | "make" | "model">("year")
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedMake, setSelectedMake] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const vehicleTypeData = vehicleData[vehicleType] || {}

  // Get unique years from all makes for this vehicle type
  const allYears = Array.from(new Set(Object.values(vehicleTypeData).flatMap((makeData) => makeData.years))).sort(
    (a, b) => b - a,
  )

  // Get makes for selected year
  const makesForYear = selectedYear
    ? Object.entries(vehicleTypeData)
        .filter(([_, makeData]) => makeData.years.includes(selectedYear))
        .map(([make]) => make)
        .sort()
    : []

  // Get models for selected make and year
  const modelsForMake = selectedMake && selectedYear ? vehicleTypeData[selectedMake]?.models.sort() || [] : []

  // Filter based on search
  const filteredYears = allYears.filter((year) => year.toString().includes(searchQuery))

  const filteredMakes = makesForYear.filter((make) => make.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredModels = modelsForMake.filter((model) => model.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleYearSelect = (year: number) => {
    setSelectedYear(year)
    setStep("make")
    setSearchQuery("")
  }

  const handleMakeSelect = (make: string) => {
    setSelectedMake(make)
    setStep("model")
    setSearchQuery("")
  }

  const handleModelSelect = (model: string) => {
    if (selectedYear && selectedMake) {
      onSelect(selectedYear, selectedMake, model)
    }
  }

  const handleBackClick = () => {
    if (step === "model") {
      setStep("make")
      setSelectedMake(null)
      setSearchQuery("")
    } else if (step === "make") {
      setStep("year")
      setSelectedYear(null)
      setSearchQuery("")
    } else {
      onBack()
    }
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={handleBackClick} className="mb-2 gap-1 text-muted-foreground">
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>

      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          {step === "year" && "Select Year"}
          {step === "make" && `Select Make (${selectedYear})`}
          {step === "model" && `Select Model (${selectedYear} ${selectedMake})`}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {step === "year" && "Choose the year of your vehicle"}
          {step === "make" && "Choose the manufacturer"}
          {step === "model" && "Choose your vehicle model"}
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={`Search ${step}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Year Selection */}
      {step === "year" && (
        <div className="grid max-h-[60vh] grid-cols-3 gap-2 overflow-y-auto">
          {filteredYears.map((year) => (
            <Card
              key={year}
              className="cursor-pointer border-2 border-border bg-card p-4 text-center transition-all hover:border-primary hover:shadow-md active:scale-[0.98]"
              onClick={() => handleYearSelect(year)}
            >
              <span className="text-lg font-semibold text-card-foreground">{year}</span>
            </Card>
          ))}
        </div>
      )}

      {/* Make Selection */}
      {step === "make" && (
        <div className="grid max-h-[60vh] gap-3 overflow-y-auto">
          {filteredMakes.map((make) => (
            <Card
              key={make}
              className="cursor-pointer border-2 border-border bg-card p-4 transition-all hover:border-primary hover:shadow-md active:scale-[0.98]"
              onClick={() => handleMakeSelect(make)}
            >
              <h3 className="text-lg font-semibold text-card-foreground">{make}</h3>
            </Card>
          ))}
        </div>
      )}

      {/* Model Selection */}
      {step === "model" && (
        <div className="grid max-h-[60vh] gap-3 overflow-y-auto">
          {filteredModels.map((model) => (
            <Card
              key={model}
              className="cursor-pointer border-2 border-border bg-card p-4 transition-all hover:border-primary hover:shadow-md active:scale-[0.98]"
              onClick={() => handleModelSelect(model)}
            >
              <h3 className="text-lg font-semibold text-card-foreground">{model}</h3>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
