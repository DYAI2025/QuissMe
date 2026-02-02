import { useState, useEffect } from "react"
import LocationPicker from "../components/LocationPicker"
import StepIndicator from "../components/StepIndicator"

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""

function BaziInput({ onSubmit, title }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState("forward")
  const [formData, setFormData] = useState({
    year: "",
    month: "",
    day: "",
    hour: "12",
    minute: "00",
    location: null,
    isPartner: false
  })
  const [errors, setErrors] = useState({})
  const [isAnimating, setIsAnimating] = useState(false)

  const totalSteps = 5
  const stepLabels = ["Start", "Datum", "Zeit", "Ort", "Fertig"]
  const currentYear = new Date().getFullYear()

  // Months in German
  const months = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ]

  // Validate current step
  const validateStep = () => {
    const newErrors = {}
    
    switch (currentStep) {
      case 1: // Date step
        if (!formData.year) newErrors.year = "Bitte wähle ein Jahr"
        if (!formData.month) newErrors.month = "Bitte wähle einen Monat"
        if (!formData.day) newErrors.day = "Bitte wähle einen Tag"
        break
      case 2: // Time step
        if (!formData.hour) newErrors.hour = "Bitte wähle eine Stunde"
        break
      case 3: // Location step
        // Location is optional but encouraged
        break
      default:
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle step transitions
  const goToNextStep = () => {
    if (validateStep() && !isAnimating) {
      setIsAnimating(true)
      setDirection("forward")
      setTimeout(() => {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1))
        setIsAnimating(false)
      }, 50)
    }
  }

  const goToPrevStep = () => {
    if (!isAnimating && currentStep > 0) {
      setIsAnimating(true)
      setDirection("backward")
      setTimeout(() => {
        setCurrentStep(prev => Math.max(prev - 1, 0))
        setIsAnimating(false)
      }, 50)
    }
  }

  // Handle location selection
  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      location: location
    }))
  }

  // Handle final submission
  const handleSubmit = () => {
    onSubmit({
      year: parseInt(formData.year),
      month: parseInt(formData.month),
      day: parseInt(formData.day),
      hour: parseInt(formData.hour),
      minute: parseInt(formData.minute),
      location: formData.location,
      latitude: formData.location?.latitude || null,
      longitude: formData.location?.longitude || null,
      timezone: formData.location?.timezone || null,
      locationName: formData.location?.name || null,
      isPartner: formData.isPartner
    })
  }

  // Get days in selected month
  const getDaysInMonth = () => {
    if (!formData.year || !formData.month) return 31
    return new Date(parseInt(formData.year), parseInt(formData.month), 0).getDate()
  }

  // Format time display
  const formatTime = () => {
    const h = formData.hour.padStart(2, "0")
    const m = formData.minute.padStart(2, "0")
    return `${h}:${m}`
  }

  // Format date display
  const formatDate = () => {
    if (!formData.year || !formData.month || !formData.day) return ""
    const monthName = months[parseInt(formData.month) - 1]
    return `${formData.day}. ${monthName} ${formData.year}`
  }

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="step-content welcome-step">
            <div className="welcome-icon">
              <span className="welcome-emoji">🔮</span>
              <div className="welcome-glow"></div>
            </div>
            <h1 className="welcome-title">Willkommen bei QuissMe</h1>
            <p className="welcome-subtitle">
              Entdecke die kosmische Verbindung zwischen euch
            </p>
            <div className="welcome-features">
              <div className="feature-item">
                <span className="feature-icon">✨</span>
                <span>Bazi-Analyse basierend auf deinen Geburtsdaten</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💫</span>
                <span>Persönliche Einblicke in eure Beziehung</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌙</span>
                <span>Tägliche Quizze für mehr Verbundenheit</span>
              </div>
            </div>
            <button 
              className="btn btn-primary btn-large start-btn"
              onClick={goToNextStep}
            >
              Los geht&apos;s
              <span className="btn-arrow">→</span>
            </button>
          </div>
        )

      case 1:
        return (
          <div className="step-content date-step">
            <div className="step-header">
              <h2>Wann wurdest du geboren?</h2>
              <p>Dein Geburtsdatum ist der Schlüssel zu deinem Bazi-Chart</p>
            </div>
            
            <div className="date-picker-grid">
              <div className="date-column year-column">
                <label>Jahr</label>
                <div className="scroll-picker">
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className={errors.year ? "error" : ""}
                  >
                    <option value="">-</option>
                    {Array.from({length: 100}, (_, i) => currentYear - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                {errors.year && <span className="error-text">{errors.year}</span>}
              </div>
              
              <div className="date-column month-column">
                <label>Monat</label>
                <div className="scroll-picker">
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({...formData, month: e.target.value})}
                    className={errors.month ? "error" : ""}
                  >
                    <option value="">-</option>
                    {months.map((m, i) => (
                      <option key={i + 1} value={i + 1}>{m}</option>
                    ))}
                  </select>
                </div>
                {errors.month && <span className="error-text">{errors.month}</span>}
              </div>
              
              <div className="date-column day-column">
                <label>Tag</label>
                <div className="scroll-picker">
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({...formData, day: e.target.value})}
                    className={errors.day ? "error" : ""}
                  >
                    <option value="">-</option>
                    {Array.from({length: getDaysInMonth()}, (_, i) => i + 1).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                {errors.day && <span className="error-text">{errors.day}</span>}
              </div>
            </div>

            {formData.year && formData.month && formData.day && (
              <div className="selected-date-preview">
                <span className="preview-icon">📅</span>
                <span className="preview-text">{formatDate()}</span>
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="step-content time-step">
            <div className="step-header">
              <h2>Um welche Uhrzeit?</h2>
              <p>Je genauer, desto präziser dein Bazi-Chart</p>
            </div>
            
            <div className="time-picker-container">
              <div className="time-display">
                <span className="time-value">{formatTime()}</span>
                <span className="time-label">Uhr</span>
              </div>
              
              <div className="time-picker-grid">
                <div className="time-column">
                  <label>Stunde</label>
                  <div className="scroll-picker">
                    <select
                      value={formData.hour}
                      onChange={(e) => setFormData({...formData, hour: e.target.value})}
                    >
                      {Array.from({length: 24}, (_, i) => i).map(h => (
                        <option key={h} value={h.toString()}>{h.toString().padStart(2, "0")}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="time-separator">:</div>
                
                <div className="time-column">
                  <label>Minute</label>
                  <div className="scroll-picker">
                    <select
                      value={formData.minute}
                      onChange={(e) => setFormData({...formData, minute: e.target.value})}
                    >
                      {Array.from({length: 60}, (_, i) => i).map(m => (
                        <option key={m} value={m.toString()}>{m.toString().padStart(2, "0")}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <p className="time-hint">
                <span className="hint-icon">💡</span>
                Falls du unsicher bist, frag deine Eltern oder schau in deiner Geburtsurkunde nach
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="step-content location-step">
            <div className="step-header">
              <h2>Wo wurdest du geboren?</h2>
              <p>Der Geburtsort hilft bei der Zeitzonenberechnung</p>
            </div>
            
            <div className="location-picker-wrapper">
              <LocationPicker 
                apiKey={GOOGLE_MAPS_API_KEY}
                onLocationSelect={handleLocationSelect}
                placeholder="Stadt oder Ort eingeben..."
              />
            </div>
            
            {!formData.location && (
              <button 
                className="skip-link"
                onClick={goToNextStep}
              >
                Überspringen →
              </button>
            )}
          </div>
        )

      case 4:
        return (
          <div className="step-content confirm-step">
            <div className="step-header">
              <div className="confirm-icon">✨</div>
              <h2>Perfekt!</h2>
              <p>Überprüfe deine Angaben</p>
            </div>
            
            <div className="confirm-card">
              <div className="confirm-row">
                <span className="confirm-label">
                  <span className="confirm-emoji">📅</span>
                  Geburtsdatum
                </span>
                <span className="confirm-value">{formatDate()}</span>
              </div>
              
              <div className="confirm-row">
                <span className="confirm-label">
                  <span className="confirm-emoji">🕐</span>
                  Geburtszeit
                </span>
                <span className="confirm-value">{formatTime()} Uhr</span>
              </div>
              
              <div className="confirm-row">
                <span className="confirm-label">
                  <span className="confirm-emoji">📍</span>
                  Geburtsort
                </span>
                <span className="confirm-value">
                  {formData.location?.name || "Nicht angegeben"}
                </span>
              </div>
              
              {formData.location?.timezone && (
                <div className="confirm-row">
                  <span className="confirm-label">
                    <span className="confirm-emoji">🌍</span>
                    Zeitzone
                  </span>
                  <span className="confirm-value timezone-badge">
                    {formData.location.timezone.name}
                  </span>
                </div>
              )}
            </div>
            
            <button 
              className="btn btn-primary btn-large submit-btn"
              onClick={handleSubmit}
            >
              Weiter zur Analyse
              <span className="btn-sparkle">✨</span>
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bazi-input-page onboarding">
      <div className="onboarding-container">
        {currentStep > 0 && (
          <StepIndicator 
            currentStep={currentStep} 
            totalSteps={totalSteps}
            stepLabels={stepLabels}
          />
        )}
        
        {currentStep > 0 && currentStep < totalSteps - 1 && (
          <button className="back-btn" onClick={goToPrevStep}>
            ← Zurück
          </button>
        )}
        
        <div className={`step-wrapper ${direction} ${isAnimating ? "animating" : ""}`}>
          {renderStepContent()}
        </div>
        
        {currentStep > 0 && currentStep < totalSteps - 1 && (
          <div className="step-navigation">
            <button 
              className="btn btn-primary"
              onClick={goToNextStep}
            >
              Weiter
              <span className="btn-arrow">→</span>
            </button>
          </div>
        )}
        
        {currentStep === totalSteps - 1 && (
          <button 
            className="edit-link"
            onClick={() => setCurrentStep(1)}
          >
            Angaben bearbeiten
          </button>
        )}
      </div>
    </div>
  )
}

export default BaziInput
