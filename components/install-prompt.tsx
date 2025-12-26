"use client"

import { useEffect, useState } from "react"
import { X, Share } from "lucide-react"
import { Button } from "@/components/ui/button"

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false)

  useEffect(() => {
    // Check if device is iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const iOS = /iphone|ipad|ipod/.test(userAgent)
    setIsIOS(iOS)

    // Check if already in standalone mode (already installed)
    const standalone = window.matchMedia("(display-mode: standalone)").matches
    setIsInStandaloneMode(standalone)

    // Check if user has previously dismissed the prompt
    const dismissed = localStorage.getItem("install-prompt-dismissed")

    // Show prompt if iOS, not in standalone mode, and hasn't been dismissed
    if (iOS && !standalone && !dismissed) {
      // Show after a short delay for better UX
      const timer = setTimeout(() => setShowPrompt(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("install-prompt-dismissed", "true")
  }

  if (!showPrompt || !isIOS || isInStandaloneMode) {
    return null
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom">
      <div className="mx-auto max-w-lg border-t border-border bg-card p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent">
            <Share className="h-5 w-5 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-balance font-semibold text-card-foreground">Install App</h3>
            <p className="mt-1 text-pretty text-sm text-muted-foreground">
              Add this app to your home screen for quick access and a better experience.
            </p>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="font-medium text-card-foreground">1.</span>
                <span>
                  Tap the <Share className="mx-1 inline h-4 w-4" /> Share button below
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-card-foreground">2.</span>
                <span>Scroll down and tap "Add to Home Screen"</span>
              </div>
            </div>
            <Button onClick={handleDismiss} variant="outline" size="sm" className="mt-4 w-full bg-transparent">
              Got it
            </Button>
          </div>
          <button
            onClick={handleDismiss}
            className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
