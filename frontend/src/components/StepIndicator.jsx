import { useEffect, useState } from "react"

function StepIndicator({ currentStep, totalSteps, stepLabels = [] }) {
  const [animatedStep, setAnimatedStep] = useState(0)
  
  useEffect(() => {
    // Animate the step change
    const timer = setTimeout(() => {
      setAnimatedStep(currentStep)
    }, 50)
    return () => clearTimeout(timer)
  }, [currentStep])
  
  const progress = ((animatedStep) / (totalSteps - 1)) * 100
  
  return (
    <div className="step-indicator">
      <div className="step-progress-track">
        <div 
          className="step-progress-fill"
          style={{ width: `${progress}%` }}
        />
        <div className="step-dots">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`step-dot ${
                index <= animatedStep ? "active" : ""
              } ${index === animatedStep ? "current" : ""}`}
            >
              <div className="dot-inner">
                {index < animatedStep ? (
                  <svg viewBox="0 0 24 24" className="check-icon">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                ) : (
                  <span className="dot-number">{index + 1}</span>
                )}
              </div>
              {stepLabels[index] && (
                <span className="step-label">{stepLabels[index]}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StepIndicator
