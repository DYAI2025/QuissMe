import { useState } from 'react'


function QuizSwipe({ quiz, quizIndex, totalQuizzes, onAnswer, onNext, bazi }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const progress = ((quizIndex) / totalQuizzes) * 100

  const handleSelect = (option, index) => {
    if (isAnimating) return
    
    setSelectedOption(index)
    setIsAnimating(true)

    // Visual feedback
    setTimeout(() => {
      onAnswer({
        type: option.type,
        score: option.score
      })
      setIsAnimating(false)
      setSelectedOption(null)
      onNext()
    }, 300)
  }

  if (!quiz) return <div className="loading">Lädt...</div>

  return (
    <div className="quiz-swipe-page">
      <div className="container">
        <header className="quiz-header">
          <div className="progress-info">
            <span>Quiz {quizIndex + 1} / {totalQuizzes}</span>
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
            {quiz.icon} {quiz.question_de}
          </h2>

          <div className="options-list">
            {quiz.options?.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${selectedOption === index ? 'selected' : ''}`}
                onClick={() => handleSelect(option, index)}
                disabled={isAnimating}
              >
                <span className="option-text">{option.text_de}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bazi Power-Up hint */}
        {bazi && (
          <div className="bazi-hint">
            <span className="bazi-icon">🔮</span>
            <span>Bazi-Power aktiv!</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizSwipe
