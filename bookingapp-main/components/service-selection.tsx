"use client"

import { Card } from "@/components/ui/card"
import { Clock, DollarSign } from "lucide-react"

export const services = [
  {
    id: "Basic",
    name: "Basic Interior Detailing",
    duration: "2.5-4 hrs",
    price: "$80",
    description: "Basic cleaning includes entire car Vaccuming, Cleaning of all Hard Plastics and Leather.",
    hasAddons: true,
  },
  {
    id: "Premium",
    name: "Full Interior Detailing",
    duration: "4-6 hrs",
    price: "$110",
    description: "Complete interior cleaning getting in all hard to reach spots.",
    hasAddons: true,
  },
  {
    id: "basicin&out",
    name: "Basic Inside & Outside",
    duration: "90 min",
    price: "$150",
    description: "Basic Interior and exterior Detailing",
    hasAddons: true,
  },
  {
    id: "premiumin&out",
    name: "Premium In & Out Detailing",
    duration: "120 min",
    price: "$125",
    description: "Premium Interior and exterior detailing",
    hasAddons: true,
  },
]

interface ServiceSelectionProps {
  onSelect: (service: string) => void
}

export function ServiceSelection({ onSelect }: ServiceSelectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-popover">Choose a Service</h2>
        <p className="mt-1 text-sm text-muted-foreground">Select the service that best fits your needs</p>
      </div>

      <div className="grid gap-3">
        {services.map((service) => (
          <Card
            key={service.id}
            className="cursor-pointer border-2 border-border bg-card p-4 transition-all hover:border-primary hover:shadow-md active:scale-[0.98]"
            onClick={() => onSelect(service.name)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-card-foreground">{service.name}</h3>
                <p className="mt-1 text-sm text-foreground">{service.description}</p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="bg-primary">{service.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>{service.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
