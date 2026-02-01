import { useState } from 'react'
import './PairQuiz.css'

function PairQuiz({ quiz, quizIndex, totalQuizzes, step, onAnswer, onNext, clusterName }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const progress = ((quizIndex + (step === 'partner' ? 0.5 : 0)) / totalQuizzes) * 100

  const handleSelect = (option, index) => {
    if (isAnimating) return
    
    setSelectedOption(index)
    setIsAnimating(true)

    setTimeout(() => {
      onAnswer(option.type)
      setIsAnimating(false)
      setSelectedOption(null)
      onNext()
    }, 400)
  }

  if (!quiz) return <div className="loading">Lädt...</div>

  return (
    <div className="pair-quiz-page">
      <div className="container">
        <header className="quiz-header fade-in">
          <div className="cluster-badge">{clusterName}</div>
          <div className="progress-info">
            <span>Frage {quizIndex + 1} von {totalQuizzes}</span>
            <span className="step-badge">{step === 'user' ? '👤 Du' : '💕 Partner'}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        <div className="quiz-card fade-in">
          <div className="quiz-context">
            {quiz.context_de}
          </div>

          <h2 className="quiz-question">
            <span className="quiz-icon">{quiz.icon}</span>
            {quiz.question_de}
          </h2>

          <div className="options-list">
            {quiz.options?.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${selectedOption === index ? 'selected' : ''}`}
                onClick={() => handleSelect(option, index)}
                disabled={isAnimating}
              >
                <span className="option-marker">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option.text_de}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="quiz-footer fade-in">
          <p className="hint">
            {step === 'user' 
              ? "Beantworte ehrlich – dein Partner sieht die Antwort erst am Ende!"
              : "Dein Partner hat geantwortet. Jetzt du!"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PairQuiz
