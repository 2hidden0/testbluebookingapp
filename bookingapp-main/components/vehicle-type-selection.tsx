"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, Truck, Bike, Bus, ArrowLeft } from "lucide-react"

export const vehicleTypes = [
  {
    id: "car",
    name: "Car",
    icon: Car,
    description: "Sedan, Coupe, Hatchback, Wagon",
  },
  {
    id: "suv",
    name: "SUV / Crossover",
    icon: Truck,
    description: "Sport Utility Vehicles and Crossovers",
  },
  {
    id: "truck",
    name: "Truck",
    icon: Truck,
    description: "Pickup Trucks and Commercial Vehicles",
  },
  {
    id: "van",
    name: "Van / Minivan",
    icon: Bus,
    description: "Passenger and Cargo Vans",
  },
  {
    id: "motorcycle",
    name: "Motorcycle",
    icon: Bike,
    description: "Motorcycles, Scooters, ATVs",
  },
]

interface VehicleTypeSelectionProps {
  onSelect: (vehicleType: string) => void
  onBack: () => void
}

export function VehicleTypeSelection({ onSelect, onBack }: VehicleTypeSelectionProps) {
  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div>
        <h2 className="text-2xl font-semibold text-foreground">Select Vehicle Type</h2>
        <p className="mt-1 text-sm text-muted-foreground">Choose the type of vehicle you need service for</p>
      </div>

      <div className="grid gap-3">
        {vehicleTypes.map((type) => {
          const Icon = type.icon
          return (
            <Card
              key={type.id}
              className="cursor-pointer border-2 border-border bg-card p-4 transition-all hover:border-primary hover:shadow-md active:scale-[0.98]"
              onClick={() => onSelect(type.id)}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground">{type.name}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{type.description}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
