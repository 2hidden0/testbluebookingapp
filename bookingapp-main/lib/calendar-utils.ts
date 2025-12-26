export function detectMobileOS() {
  const userAgent = window.navigator.userAgent.toLowerCase()
  const iOS = /iphone|ipad|ipod/.test(userAgent)
  const android = /android/.test(userAgent)

  return { iOS, android, isMobile: iOS || android }
}

export function detectInstalledCalendarApps() {
  const { iOS, android } = detectMobileOS()

  const availableApps: Array<{
    name: string
    icon: string
    scheme: string
    fallback: () => void
  }> = []

  if (iOS) {
    availableApps.push(
      { name: "Apple Calendar", icon: "🍎", scheme: "calshow:", fallback: () => {} },
      { name: "Google Calendar", icon: "📅", scheme: "googlecalendar:", fallback: () => {} },
      { name: "Outlook", icon: "📧", scheme: "ms-outlook:", fallback: () => {} },
    )
  } else if (android) {
    availableApps.push(
      { name: "Google Calendar", icon: "📅", scheme: "content://com.android.calendar", fallback: () => {} },
      { name: "Outlook", icon: "📧", scheme: "ms-outlook:", fallback: () => {} },
      { name: "Samsung Calendar", icon: "📆", scheme: "content://com.android.calendar", fallback: () => {} },
    )
  }

  return availableApps
}

export function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
}

export function createCalendarURL(
  provider: string,
  eventData: {
    title: string
    description: string
    location: string
    startDate: Date
    endDate: Date
  },
) {
  const { title, description, location, startDate, endDate } = eventData

  switch (provider) {
    case "icloud":
      return `https://www.icloud.com/calendar?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}`

    case "google":
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&dates=${formatICSDate(startDate)}/${formatICSDate(endDate)}`

    case "outlook":
      return `https://outlook.live.com/calendar/0/action/compose?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}`

    case "office365":
      return `https://outlook.office.com/calendar/0/action/compose?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}`

    case "yahoo":
      return `https://calendar.yahoo.com/?v=60&title=${encodeURIComponent(title)}&desc=${encodeURIComponent(description)}&in_loc=${encodeURIComponent(location)}&st=${formatICSDate(startDate)}&et=${formatICSDate(endDate)}`

    default:
      return ""
  }
}

export function generateICS(eventData: {
  title: string
  description: string
  location: string
  startDate: Date
  endDate: Date
}): string {
  const { title, description, location, startDate, endDate } = eventData

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Booking App//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${Date.now()}@bookingapp.com
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${title}
DESCRIPTION:${description.replace(/\n/g, "\\n")}
LOCATION:${location}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`
}

export function openCalendarApp(scheme: string, icsData: string, fallback: () => void) {
  const { iOS } = detectMobileOS()

  if (iOS && scheme === "calshow:") {
    // For iOS, create a data URL with the ICS content
    const dataUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsData)}`
    window.location.href = dataUrl
    return
  }

  // Try opening the app scheme
  const timeout = setTimeout(() => {
    // If app doesn't open, fall back
    fallback()
  }, 1500)

  window.addEventListener("blur", () => {
    clearTimeout(timeout)
  })

  try {
    window.location.href = scheme
  } catch (error) {
    clearTimeout(timeout)
    fallback()
  }
}
