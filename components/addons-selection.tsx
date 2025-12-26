"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Check, Plus } from "lucide-react"

const addons = [
  {
    id: "express",
    name: "Express Treatment",
    price: "$25",
    description: "Quick add-on treatment for enhanced results",
  },
  {
    id: "aromatherapy",
    name: "Aromatherapy",
    price: "$15",
    description: "Relaxing essential oils for a calming experience",
  },
  {
    id: "extended-consult",
    name: "Extended Consultation",
    price: "$30",
    description: "Additional one-on-one time with specialist",
  },
  {
    id: "premium-products",
    name: "Premium Products",
    price: "$40",
    description: "Upgrade to premium-grade products",
  },
]

interface AddonsSelectionProps {
  onContinue: (selectedAddons: string[]) => void
  onBack: () => void
}

export function AddonsSelection({ onContinue, onBack }: AddonsSelectionProps) {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])

  const toggleAddon = (addonName: string) => {
    setSelectedAddons((prev) => (prev.includes(addonName) ? prev.filter((a) => a !== addonName) : [...prev, addonName]))
  }

  const handleContinue = () => {
    onContinue(selectedAddons)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground">Add-Ons</h2>
          <p className="text-sm text-muted-foreground">Optional extras</p>
        </div>
        <div className="w-10" />
      </div>

      <div className="grid gap-3">
        {addons.map((addon) => {
          const isSelected = selectedAddons.includes(addon.name)
          return (
            <Card
              key={addon.id}
              className={`cursor-pointer border-2 p-4 transition-all active:scale-[0.98] ${
                isSelected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
              }`}
              onClick={() => toggleAddon(addon.name)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-card-foreground">{addon.name}</h3>
                    <span className="text-sm font-bold text-foreground">{addon.price}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{addon.description}</p>
                </div>
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isSelected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="space-y-3">
        <Button className="w-full h-12 text-base" onClick={handleContinue}>
          {selectedAddons.length > 0
            ? `Continue with ${selectedAddons.length} Add-On${selectedAddons.length > 1 ? "s" : ""}`
            : "Skip Add-Ons"}
        </Button>
      </div>

      {selectedAddons.length > 0 && (
        <Card className="bg-muted p-4">
          <p className="text-sm text-muted-foreground text-center">
            Selected: <span className="font-medium text-foreground">{selectedAddons.join(", ")}</span>
          </p>
        </Card>
      )}
    </div>
  )
}
