// App State
let appState = {
  step: "service",
  selectedService: "",
  selectedServiceData: null,
  selectedVehicleType: "",
  selectedYear: null,
  selectedMake: "",
  selectedModel: "",
  selectedAddons: [],
  selectedDate: null,
  selectedTime: "",
  contactInfo: { name: "", email: "", phone: "", notes: "" },
  vehicleYMMStep: "year",
  vehicleSearchQuery: "",
  currentMonth: new Date(),
  showCalendarOptions: false,
}

// Services Data
const services = [
  {
    id: "consultation",
    name: "Consultation",
    duration: "30 min",
    price: "$50",
    description: "Initial consultation and assessment",
    hasAddons: false,
  },
  {
    id: "standard",
    name: "Standard Service",
    duration: "60 min",
    price: "$100",
    description: "Comprehensive standard service package",
    hasAddons: true,
  },
  {
    id: "premium",
    name: "Premium Service",
    duration: "90 min",
    price: "$150",
    description: "Full premium experience with extras",
    hasAddons: true,
  },
  {
    id: "extended",
    name: "Extended Session",
    duration: "120 min",
    price: "$200",
    description: "Extended session for complex needs",
    hasAddons: true,
  },
]

// Vehicle Types
const vehicleTypes = [
  { id: "car", name: "Car", icon: "car", description: "Sedan, Coupe, Hatchback, Wagon" },
  { id: "suv", name: "SUV / Crossover", icon: "truck", description: "Sport Utility Vehicles and Crossovers" },
  { id: "truck", name: "Truck", icon: "truck", description: "Pickup Trucks and Commercial Vehicles" },
  { id: "van", name: "Van / Minivan", icon: "bus", description: "Passenger and Cargo Vans" },
  { id: "motorcycle", name: "Motorcycle", icon: "bike", description: "Motorcycles, Scooters, ATVs" },
]

// Add-ons
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
  { id: "premium-products", name: "Premium Products", price: "$40", description: "Upgrade to premium-grade products" },
]

// Time Slots
const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
]

// Vehicle Data
const vehicleData = {
  car: {
    Toyota: { years: [2020, 2021, 2022] },
    Honda: { years: [2019, 2020, 2021] },
  },
  suv: {
    Ford: { years: [2020, 2021] },
    Chevrolet: { years: [2019, 2020] },
  },
  truck: {
    Ford: { years: [2020, 2021] },
    Chevrolet: { years: [2019, 2020] },
  },
  van: {
    Ford: { years: [2020, 2021] },
    Chevrolet: { years: [2019, 2020] },
  },
  motorcycle: {
    Yamaha: { years: [2020, 2021] },
    Honda: { years: [2019, 2020] },
  },
}

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  render()
  setupPWA()
})

// Main Render Function
function render() {
  updateProgressBar()
  renderStep()
}

// Update Progress Bar
function updateProgressBar() {
  const progressBar = document.getElementById("progressBar")
  const serviceData = services.find((s) => s.name === appState.selectedService)
  const hasAddons = serviceData?.hasAddons ?? false

  if (appState.step === "confirmation") {
    progressBar.innerHTML = ""
    return
  }

  const steps = hasAddons
    ? ["Service", "Vehicle", "Details", "Add-ons", "Date", "Contact"]
    : ["Service", "Vehicle", "Details", "Date", "Contact"]

  const stepMap = hasAddons
    ? { service: 0, vehicleType: 1, vehicleYMM: 2, addons: 3, datetime: 4, contact: 5 }
    : { service: 0, vehicleType: 1, vehicleYMM: 2, datetime: 3, contact: 4 }

  const currentIdx = stepMap[appState.step]

  let html = '<div class="progress-steps">'
  steps.forEach((stepName, idx) => {
    if (idx > 0) {
      html += `<div class="progress-line ${idx <= currentIdx ? "complete" : "incomplete"}"></div>`
    }
    const circleClass = idx === currentIdx ? "active" : idx < currentIdx ? "complete" : "incomplete"
    html += `
      <div class="progress-step">
        <div class="progress-step-circle ${circleClass}">${idx + 1}</div>
        <span class="progress-step-label">${stepName}</span>
      </div>`
  })
  html += "</div>"

  progressBar.innerHTML = html
}

// Render Current Step
function renderStep() {
  const container = document.getElementById("appContainer")

  switch (appState.step) {
    case "service":
      container.innerHTML = renderServiceSelection()
      break
    case "vehicleType":
      container.innerHTML = renderVehicleTypeSelection()
      break
    case "vehicleYMM":
      container.innerHTML = renderVehicleYMMSelection()
      break
    case "addons":
      container.innerHTML = renderAddonsSelection()
      break
    case "datetime":
      container.innerHTML = renderDateTimeSelection()
      break
    case "contact":
      container.innerHTML = renderContactForm()
      break
    case "confirmation":
      container.innerHTML = renderConfirmation()
      break
  }
}

// Service Selection
function renderServiceSelection() {
  let html = '<div><h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem;">Choose a Service</h2>'
  html +=
    '<p class="text-muted" style="font-size: 0.875rem; margin-bottom: 1rem;">Select the service that best fits your needs</p></div>'
  html += '<div class="grid">'

  services.forEach((service) => {
    html += `
      <div class="card" onclick="selectService('${service.name}')">
        <h3 style="font-size: 1.125rem; font-weight: 600;">${service.name}</h3>
        <p class="text-muted" style="font-size: 0.875rem; margin-top: 0.25rem;">${service.description}</p>
        <div style="display: flex; align-items: center; gap: 1rem; margin-top: 0.75rem; font-size: 0.875rem;">
          <span class="text-muted">⏱️ ${service.duration}</span>
          <span style="font-weight: 600;">💵 ${service.price}</span>
        </div>
      </div>`
  })

  html += "</div>"
  return html
}

function selectService(serviceName) {
  appState.selectedService = serviceName
  appState.selectedServiceData = services.find((s) => s.name === serviceName)
  appState.step = "vehicleType"
  render()
}

// Vehicle Type Selection
function renderVehicleTypeSelection() {
  let html =
    '<button class="btn btn-ghost" onclick="goToStep(\'service\')" style="margin-bottom: 1rem; padding: 0.5rem; width: auto;">← Back</button>'
  html += '<div><h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem;">Select Vehicle Type</h2>'
  html +=
    '<p class="text-muted" style="font-size: 0.875rem; margin-bottom: 1rem;">Choose the type of vehicle you need service for</p></div>'
  html += '<div class="grid">'

  vehicleTypes.forEach((type) => {
    html += `
      <div class="card" onclick="selectVehicleType('${type.id}')">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 3rem; height: 3rem; border-radius: 9999px; background: color-mix(in oklch, var(--primary) 10%, transparent); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
            🚗
          </div>
          <div>
            <h3 style="font-size: 1.125rem; font-weight: 600;">${type.name}</h3>
            <p class="text-muted" style="font-size: 0.875rem;">${type.description}</p>
          </div>
        </div>
      </div>`
  })

  html += "</div>"
  return html
}

function selectVehicleType(typeId) {
  appState.selectedVehicleType = typeId
  appState.vehicleYMMStep = "year"
  appState.vehicleSearchQuery = ""
  appState.step = "vehicleYMM"
  render()
}

// Vehicle Year/Make/Model Selection
function renderVehicleYMMSelection() {
  const vehicleTypeData = vehicleData[appState.selectedVehicleType] || {}

  let html =
    '<button class="btn btn-ghost" onclick="handleVehicleYMMBack()" style="margin-bottom: 1rem; padding: 0.5rem; width: auto;">← Back</button>'

  if (appState.vehicleYMMStep === "year") {
    const allYears = [...new Set(Object.values(vehicleTypeData).flatMap((m) => m.years))].sort((a, b) => b - a)
    const filteredYears = allYears.filter((y) => y.toString().includes(appState.vehicleSearchQuery))

    html += '<div><h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem;">Select Year</h2>'
    html +=
      '<p class="text-muted" style="font-size: 0.875rem; margin-bottom: 1rem;">Choose the year of your vehicle</p></div>'
    html +=
      '<input type="text" class="input" placeholder="Search year..." value="' +
      appState.vehicleSearchQuery +
      '" oninput="updateVehicleSearch(this.value)" style="margin-bottom: 1rem;">'
    html += '<div class="grid grid-cols-3" style="max-height: 60vh; overflow-y: auto;">'

    filteredYears.forEach((year) => {
      html += `<div class="card" onclick="selectYear(${year})"><span style="font-size: 1.125rem; font-weight: 600;">${year}</span></div>`
    })

    html += "</div>"
  } else if (appState.vehicleYMMStep === "make") {
    const makesForYear = Object.entries(vehicleTypeData)
      .filter(([_, data]) => data.years.includes(appState.selectedYear))
      .map(([make]) => make)
      .sort()
    const filteredMakes = makesForYear.filter((m) =>
      m.toLowerCase().includes(appState.vehicleSearchQuery.toLowerCase()),
    )

    html += `<div><h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem;">Select Make (${appState.selectedYear})</h2>`
    html += '<p class="text-muted" style="font-size: 0.875rem; margin-bottom: 1rem;">Choose the manufacturer</p></div>'
    html +=
      '<input type="text" class="input" placeholder="Search make..." value="' +
      appState.vehicleSearchQuery +
      '" oninput="updateVehicleSearch(this.value)" style="margin-bottom: 1rem;">'
    html += '<div class="grid" style="max-height: 60vh; overflow-y: auto;">'

    filteredMakes.forEach((make) => {
      html += `<div class="card" onclick="selectMake('${make}')"><h3 style="font-size: 1.125rem; font-weight: 600;">${make}</h3></div>`
    })

    html += "</div>"
  } else if (appState.vehicleYMMStep === "model") {
    const models = vehicleTypeData[appState.selectedMake]?.models.sort() || []
    const filteredModels = models.filter((m) => m.toLowerCase().includes(appState.vehicleSearchQuery.toLowerCase()))

    html += `<div><h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem;">Select Model (${appState.selectedYear} ${appState.selectedMake})</h2>`
    html +=
      '<p class="text-muted" style="font-size: 0.875rem; margin-bottom: 1rem;">Choose your vehicle model</p></div>'
    html +=
      '<input type="text" class="input" placeholder="Search model..." value="' +
      appState.vehicleSearchQuery +
      '" oninput="updateVehicleSearch(this.value)" style="margin-bottom: 1rem;">'
    html += '<div class="grid" style="max-height: 60vh; overflow-y: auto;">'

    filteredModels.forEach((model) => {
      html += `<div class="card" onclick="selectModel('${model}')"><h3 style="font-size: 1.125rem; font-weight: 600;">${model}</h3></div>`
    })

    html += "</div>"
  }

  return html
}

function handleVehicleYMMBack() {
  if (appState.vehicleYMMStep === "model") {
    appState.vehicleYMMStep = "make"
    appState.selectedMake = ""
    appState.vehicleSearchQuery = ""
  } else if (appState.vehicleYMMStep === "make") {
    appState.vehicleYMMStep = "year"
    appState.selectedYear = null
    appState.vehicleSearchQuery = ""
  } else {
    appState.step = "vehicleType"
  }
  render()
}

function updateVehicleSearch(value) {
  appState.vehicleSearchQuery = value
  render()
}

function selectYear(year) {
  appState.selectedYear = year
  appState.vehicleYMMStep = "make"
  appState.vehicleSearchQuery = ""
  render()
}

function selectMake(make) {
  appState.selectedMake = make
  appState.vehicleYMMStep = "model"
  appState.vehicleSearchQuery = ""
  render()
}

function selectModel(model) {
  appState.selectedModel = model
  const hasAddons = appState.selectedServiceData?.hasAddons ?? false
  appState.step = hasAddons ? "addons" : "datetime"
  render()
}

// Add-ons Selection
function renderAddonsSelection() {
  let html =
    '<button class="btn btn-ghost" onclick="goToStep(\'vehicleYMM\')" style="margin-bottom: 1rem; padding: 0.5rem; width: auto;">← Back</button>'
  html +=
    '<div class="text-center"><h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.25rem;">Add-Ons</h2>'
  html += '<p class="text-muted" style="font-size: 0.875rem; margin-bottom: 1rem;">Optional extras</p></div>'
  html += '<div class="grid">'

  addons.forEach((addon) => {
    const isSelected = appState.selectedAddons.includes(addon.name)
    html += `
      <div class="card ${isSelected ? "selected" : ""}" onclick="toggleAddon('${addon.name}')">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <h3 style="font-size: 1rem; font-weight: 600;">${addon.name}</h3>
              <span style="font-size: 0.875rem; font-weight: 700;">${addon.price}</span>
            </div>
            <p class="text-muted" style="font-size: 0.875rem; margin-top: 0.25rem;">${addon.description}</p>
          </div>
          <div style="width: 2rem; height: 2rem; border-radius: 9999px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">${isSelected ? "✓" : "+"}</div>
        </div>
      </div>`
  })

  html += "</div>"
  html += `<button class="btn btn-primary" onclick="continueFromAddons()" style="margin-top: 1.5rem;">
    ${appState.selectedAddons.length > 0 ? `Continue with ${appState.selectedAddons.length} Add-On${appState.selectedAddons.length > 1 ? "s" : ""}` : "Skip Add-Ons"}
  </button>`

  if (appState.selectedAddons.length > 0) {
    html += `<div class="card" style="margin-top: 1rem; background: var(--muted); padding: 1rem;">
      <p class="text-muted text-center" style="font-size: 0.875rem;">Selected: <span style="font-weight: 500; color: var(--foreground);">${appState.selectedAddons.join(", ")}</span></p>
    </div>`
  }

  return html
}

function toggleAddon(addonName) {
  const idx = appState.selectedAddons.indexOf(addonName)
  if (idx > -1) {
    appState.selectedAddons.splice(idx, 1)
  } else {
    appState.selectedAddons.push(addonName)
  }
  render()
}

function continueFromAddons() {
  appState.step = "datetime"
  render()
}

// Date & Time Selection
function renderDateTimeSelection() {
  const hasAddons = appState.selectedServiceData?.hasAddons ?? false
  let html = `<button class="btn btn-ghost" onclick="goToStep('${hasAddons ? "addons" : "vehicleYMM"}')" style="margin-bottom: 1rem; padding: 0.5rem; width: auto;">← Back</button>`
  html +=
    '<div class="text-center"><h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1.5rem;">Select Date & Time</h2></div>'

  // Calendar
  html += '<div class="card calendar">'
  html += renderCalendar()
  html += "</div>"

  // Time Slots
  if (appState.selectedDate) {
    html +=
      '<div style="margin-top: 1.5rem;"><h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.75rem;">Available Times</h3>'
    html += '<div class="grid grid-cols-3">'
    timeSlots.forEach((time) => {
      const isSelected = appState.selectedTime === time
      html += `<button class="btn ${isSelected ? "btn-primary" : "btn-outline"}" onclick="selectTime('${time}')" style="height: 3rem;">${time}</button>`
    })
    html += "</div></div>"
  }

  // Continue Button
  const disabled = !appState.selectedDate || !appState.selectedTime
  html += `<button class="btn btn-primary" onclick="continueToContact()" ${disabled ? "disabled" : ""} style="margin-top: 1.5rem;">Continue to Contact Info</button>`

  return html
}

function renderCalendar() {
  const year = appState.currentMonth.getFullYear()
  const month = appState.currentMonth.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  let html = '<div class="calendar-header">'
  html +=
    '<button class="btn btn-ghost" onclick="previousMonth()" style="width: 2.5rem; height: 2.5rem; padding: 0;">◀</button>'
  html += `<span style="font-weight: 600;">${monthNames[month]} ${year}</span>`
  html +=
    '<button class="btn btn-ghost" onclick="nextMonth()" style="width: 2.5rem; height: 2.5rem; padding: 0;">▶</button>'
  html += "</div>"

  html += '<div class="calendar-grid">'

  // Day headers
  ;["S", "M", "T", "W", "T", "F", "S"].forEach((day) => {
    html += `<div class="calendar-day-header">${day}</div>`
  })

  // Empty days
  for (let i = 0; i < startingDayOfWeek; i++) {
    html += "<div></div>"
  }

  // Days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const isSelected =
      appState.selectedDate &&
      appState.selectedDate.getDate() === day &&
      appState.selectedDate.getMonth() === month &&
      appState.selectedDate.getFullYear() === year
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))

    html += `<button class="calendar-day ${isSelected ? "selected" : ""} ${isPast ? "disabled" : ""}" 
      onclick="selectDate(${year}, ${month}, ${day})" ${isPast ? "disabled" : ""}>${day}</button>`
  }

  html += "</div>"
  return html
}

function previousMonth() {
  appState.currentMonth = new Date(appState.currentMonth.getFullYear(), appState.currentMonth.getMonth() - 1)
  render()
}

function nextMonth() {
  appState.currentMonth = new Date(appState.currentMonth.getFullYear(), appState.currentMonth.getMonth() + 1)
  render()
}

function selectDate(year, month, day) {
  appState.selectedDate = new Date(year, month, day)
  appState.selectedTime = ""
  render()
}

function selectTime(time) {
  appState.selectedTime = time
  render()
}

function continueToContact() {
  appState.step = "contact"
  render()
}

// Contact Form
function renderContactForm() {
  let html =
    '<button class="btn btn-ghost" onclick="goToStep(\'datetime\')" style="margin-bottom: 1rem; padding: 0.5rem; width: auto;">← Back</button>'
  html +=
    '<div class="text-center"><h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1.5rem;">Your Information</h2></div>'

  if (appState.selectedAddons.length > 0) {
    html += `<div class="card" style="background: color-mix(in oklch, var(--primary) 5%, var(--card)); border-color: color-mix(in oklch, var(--primary) 20%, var(--border)); padding: 0.75rem; margin-bottom: 1rem;">
      <p style="font-size: 0.875rem; color: var(--muted-foreground);"><span style="font-weight: 500; color: var(--foreground);">Selected add-ons:</span> ${appState.selectedAddons.join(", ")}</p>
    </div>`
  }

  html += '<div class="card" style="padding: 1.5rem;"><form onsubmit="submitContact(event)" id="contactForm">'
  html += '<div style="margin-bottom: 1rem;"><label class="label">Full Name</label>'
  html += '<input type="text" class="input" id="name" placeholder="John Doe" required style="height: 3rem;"></div>'
  html += '<div style="margin-bottom: 1rem;"><label class="label">Email Address</label>'
  html +=
    '<input type="email" class="input" id="email" placeholder="john@example.com" required style="height: 3rem;"></div>'
  html += '<div style="margin-bottom: 1rem;"><label class="label">Phone Number</label>'
  html +=
    '<input type="tel" class="input" id="phone" placeholder="(555) 123-4567" required style="height: 3rem;"></div>'
  html += '<div style="margin-bottom: 1rem;"><label class="label">Additional Notes (Optional)</label>'
  html +=
    '<textarea class="textarea" id="notes" placeholder="Any special requests or information we should know..."></textarea></div>'

  html += '<div id="formError" class="alert alert-error hidden" style="margin-bottom: 1rem;"></div>'

  html += '<button type="submit" class="btn btn-primary" id="submitBtn">Confirm Booking</button>'
  html += "</form></div>"

  html += `<div class="card alert-info" style="margin-top: 1rem; padding: 1rem;">
    <p style="font-size: 0.875rem; color: var(--muted-foreground);"><strong>First time?</strong> Check your inbox (harmangidda@icloud.com) for a confirmation email from FormSubmit to activate notifications.</p>
  </div>`

  return html
}

async function submitContact(e) {
  e.preventDefault()

  const name = document.getElementById("name").value
  const email = document.getElementById("email").value
  const phone = document.getElementById("phone").value
  const notes = document.getElementById("notes").value

  const submitBtn = document.getElementById("submitBtn")
  const formError = document.getElementById("formError")

  submitBtn.disabled = true
  submitBtn.innerHTML = '<span class="spinner"></span> Submitting...'
  formError.classList.add("hidden")

  const bookingData = {
    name,
    email,
    phone,
    service: appState.selectedService,
    vehicle: `${appState.selectedYear} ${appState.selectedMake} ${appState.selectedModel}`,
    date: appState.selectedDate?.toLocaleDateString() || "",
    time: appState.selectedTime,
    addons: appState.selectedAddons.length > 0 ? appState.selectedAddons.join(", ") : "None",
    notes: notes || "No additional notes",
    _subject: `New Booking: ${appState.selectedService}`,
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
      appState.contactInfo = { name, email, phone, notes }
      appState.step = "confirmation"
      render()
    } else {
      throw new Error("Submission failed")
    }
  } catch (err) {
    formError.textContent = "⚠️ Failed to submit booking. Please try again."
    formError.classList.remove("hidden")
    submitBtn.disabled = false
    submitBtn.textContent = "Confirm Booking"
  }
}

// Confirmation
function renderConfirmation() {
  let html = '<div class="text-center" style="margin-bottom: 1.5rem;">'
  html +=
    '<div style="width: 4rem; height: 4rem; margin: 0 auto; background: var(--accent); border-radius: 9999px; display: flex; align-items: center; justify-content: center; font-size: 2rem;">✓</div>'
  html += '<h2 style="font-size: 1.5rem; font-weight: 600; margin-top: 1rem;">Booking Confirmed!</h2>'
  html +=
    '<p class="text-muted" style="font-size: 0.875rem; margin-top: 0.5rem;">We\'ve sent a confirmation email to your inbox</p>'
  html += "</div>"

  html +=
    '<div class="card" style="padding: 1.5rem;"><h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Appointment Details</h3>'
  html += '<div style="display: flex; flex-direction: column; gap: 1rem;">'

  const details = [
    { icon: "📅", label: "Service", value: appState.selectedService },
    {
      icon: "🚗",
      label: "Vehicle",
      value: `${appState.selectedYear} ${appState.selectedMake} ${appState.selectedModel}`,
    },
    {
      icon: "⏰",
      label: "Date & Time",
      value: `${appState.selectedDate?.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} at ${appState.selectedTime}`,
    },
  ]

  if (appState.selectedAddons.length > 0) {
    details.push({ icon: "✨", label: "Add-Ons", value: appState.selectedAddons.join(", ") })
  }

  details.push(
    { icon: "👤", label: "Name", value: appState.contactInfo.name },
    { icon: "✉️", label: "Email", value: appState.contactInfo.email },
    { icon: "📞", label: "Phone", value: appState.contactInfo.phone },
  )

  details.forEach((detail) => {
    html += `<div style="display: flex; align-items: start; gap: 0.75rem;">
      <div style="width: 2rem; height: 2rem; border-radius: 9999px; background: var(--muted); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">${detail.icon}</div>
      <div><p style="font-size: 0.875rem; font-weight: 500;">${detail.label}</p>
      <p class="text-muted" style="font-size: 0.875rem;">${detail.value}</p></div>
    </div>`
  })

  html += "</div></div>"

  html += '<div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">'
  html += '<button class="btn btn-primary" onclick="newBooking()">Book Another Appointment</button>'
  html +=
    '<button class="btn btn-outline" onclick="toggleCalendarOptions()" style="justify-content: space-between;">📅 Add to Calendar <span id="chevron">▼</span></button>'
  html += '<div id="calendarOptions" class="hidden card" style="margin-top: 0.5rem; padding: 0.5rem;"></div>'
  html += "</div>"

  html += `<div class="card" style="margin-top: 1.5rem; background: var(--muted); padding: 1rem;">
    <p class="text-muted text-center" style="font-size: 0.875rem;">Need to make changes? Contact us at <span style="font-weight: 500; color: var(--foreground);">(555) 123-4567</span></p>
  </div>`

  return html
}

function toggleCalendarOptions() {
  const optionsDiv = document.getElementById("calendarOptions")
  const chevron = document.getElementById("chevron")
  appState.showCalendarOptions = !appState.showCalendarOptions

  if (appState.showCalendarOptions) {
    chevron.textContent = "▲"
    const options = [
      { name: "Apple Calendar", icon: "🍎", action: "downloadICS", desc: "Downloads .ics file" },
      { name: "Google Calendar", icon: "📅", action: "openGoogle", desc: "Opens in browser" },
      { name: "Outlook", icon: "📧", action: "openOutlook", desc: "Opens in browser" },
      { name: "Yahoo Calendar", icon: "📆", action: "openYahoo", desc: "Opens in browser" },
      { name: "Other (.ics)", icon: "📁", action: "downloadICS", desc: "Downloads .ics file" },
    ]

    let html = ""
    options.forEach((opt) => {
      html += `<button onclick="${opt.action}()" style="width: 100%; display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-radius: 0.5rem; border: none; background: transparent; cursor: pointer; text-align: left; transition: all 0.2s;" onmouseover="this.style.background='var(--muted)'" onmouseout="this.style.background='transparent'">
        <span style="font-size: 1.25rem;">${opt.icon}</span>
        <div><p style="font-size: 0.875rem; font-weight: 500; color: var(--foreground);">${opt.name}</p>
        <p style="font-size: 0.75rem; color: var(--muted-foreground);">${opt.desc}</p></div>
      </button>`
    })
    optionsDiv.innerHTML = html
    optionsDiv.classList.remove("hidden")
  } else {
    chevron.textContent = "▼"
    optionsDiv.classList.add("hidden")
  }
}

function downloadICS() {
  const start = new Date(appState.selectedDate)
  const [timePart, period] = appState.selectedTime.split(" ")
  const [hours, minutes] = timePart.split(":").map(Number)
  let hour24 = hours
  if (period === "PM" && hours !== 12) hour24 += 12
  if (period === "AM" && hours === 12) hour24 = 0
  start.setHours(hour24, minutes, 0, 0)

  const end = new Date(start)
  end.setHours(end.getHours() + 1)

  const formatICSDate = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  const addonsText = appState.selectedAddons.length > 0 ? `\\nAdd-ons: ${appState.selectedAddons.join(", ")}` : ""

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Booking App//EN
BEGIN:VEVENT
UID:${Date.now()}@bookingapp.com
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(start)}
DTEND:${formatICSDate(end)}
SUMMARY:${appState.selectedService} Appointment
DESCRIPTION:Service: ${appState.selectedService}\\nVehicle: ${appState.selectedYear} ${appState.selectedMake} ${appState.selectedModel}${addonsText}\\nBooked by: ${appState.contactInfo.name}\\nPhone: ${appState.contactInfo.phone}\\nEmail: ${appState.contactInfo.email}
LOCATION:Business Location
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `appointment-${appState.selectedService.toLowerCase().replace(/\s+/g, "-")}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function openGoogle() {
  const start = new Date(appState.selectedDate)
  const [timePart, period] = appState.selectedTime.split(" ")
  const [hours, minutes] = timePart.split(":").map(Number)
  let hour24 = hours
  if (period === "PM" && hours !== 12) hour24 += 12
  if (period === "AM" && hours === 12) hour24 = 0
  start.setHours(hour24, minutes, 0, 0)

  const end = new Date(start)
  end.setHours(end.getHours() + 1)

  const formatGoogleDate = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  const addonsText = appState.selectedAddons.length > 0 ? `\nAdd-ons: ${appState.selectedAddons.join(", ")}` : ""

  const title = encodeURIComponent(`${appState.selectedService} Appointment`)
  const details = encodeURIComponent(
    `Service: ${appState.selectedService}\nVehicle: ${appState.selectedYear} ${appState.selectedMake} ${appState.selectedModel}${addonsText}\nBooked by: ${appState.contactInfo.name}\nPhone: ${appState.contactInfo.phone}\nEmail: ${appState.contactInfo.email}`,
  )
  const location = encodeURIComponent("Business Location")
  const dates = `${formatGoogleDate(start)}/${formatGoogleDate(end)}`

  window.open(
    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`,
    "_blank",
  )
}

function openOutlook() {
  const start = new Date(appState.selectedDate)
  const [timePart, period] = appState.selectedTime.split(" ")
  const [hours, minutes] = timePart.split(":").map(Number)
  let hour24 = hours
  if (period === "PM" && hours !== 12) hour24 += 12
  if (period === "AM" && hours === 12) hour24 = 0
  start.setHours(hour24, minutes, 0, 0)

  const end = new Date(start)
  end.setHours(end.getHours() + 1)

  const addonsText = appState.selectedAddons.length > 0 ? `\nAdd-ons: ${appState.selectedAddons.join(", ")}` : ""
  const title = encodeURIComponent(`${appState.selectedService} Appointment`)
  const body = encodeURIComponent(
    `Service: ${appState.selectedService}\nVehicle: ${appState.selectedYear} ${appState.selectedMake} ${appState.selectedModel}${addonsText}\nBooked by: ${appState.contactInfo.name}\nPhone: ${appState.contactInfo.phone}\nEmail: ${appState.contactInfo.email}`,
  )
  const location = encodeURIComponent("Business Location")

  window.open(
    `https://outlook.live.com/calendar/0/action/compose?subject=${title}&body=${body}&location=${location}&startdt=${start.toISOString()}&enddt=${end.toISOString()}`,
    "_blank",
  )
}

function openYahoo() {
  const start = new Date(appState.selectedDate)
  const [timePart, period] = appState.selectedTime.split(" ")
  const [hours, minutes] = timePart.split(":").map(Number)
  let hour24 = hours
  if (period === "PM" && hours !== 12) hour24 += 12
  if (period === "AM" && hours === 12) hour24 = 0
  start.setHours(hour24, minutes, 0, 0)

  const end = new Date(start)
  end.setHours(end.getHours() + 1)

  const formatYahooDate = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  const addonsText = appState.selectedAddons.length > 0 ? `\nAdd-ons: ${appState.selectedAddons.join(", ")}` : ""

  const title = encodeURIComponent(`${appState.selectedService} Appointment`)
  const desc = encodeURIComponent(
    `Service: ${appState.selectedService}\nVehicle: ${appState.selectedYear} ${appState.selectedMake} ${appState.selectedModel}${addonsText}\nBooked by: ${appState.contactInfo.name}\nPhone: ${appState.contactInfo.phone}\nEmail: ${appState.contactInfo.email}`,
  )
  const location = encodeURIComponent("Business Location")

  window.open(
    `https://calendar.yahoo.com/?v=60&title=${title}&desc=${desc}&in_loc=${location}&st=${formatYahooDate(start)}&et=${formatYahooDate(end)}`,
    "_blank",
  )
}

function newBooking() {
  appState = {
    step: "service",
    selectedService: "",
    selectedServiceData: null,
    selectedVehicleType: "",
    selectedYear: null,
    selectedMake: "",
    selectedModel: "",
    selectedAddons: [],
    selectedDate: null,
    selectedTime: "",
    contactInfo: { name: "", email: "", phone: "", notes: "" },
    vehicleYMMStep: "year",
    vehicleSearchQuery: "",
    currentMonth: new Date(),
    showCalendarOptions: false,
  }
  render()
}

function goToStep(step) {
  appState.step = step
  render()
}

// PWA Installation
function setupPWA() {
  let deferredPrompt
  const installPrompt = document.getElementById("installPrompt")
  const installButton = document.getElementById("installButton")
  const dismissButton = document.getElementById("dismissInstall")

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault()
    deferredPrompt = e
    installPrompt.classList.remove("hidden")
  })

  installButton.addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      deferredPrompt = null
      installPrompt.classList.add("hidden")
    }
  })

  dismissButton.addEventListener("click", () => {
    installPrompt.classList.add("hidden")
  })
}
