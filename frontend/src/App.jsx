import { useState, useEffect } from 'react'
import QuizData from './data/quizzes_complete.json'
import './App.css'

// Pages
import BaziInput from './pages/BaziInput'
import ClusterSelect from './pages/ClusterSelect'
import QuizSwipe from './pages/QuizSwipe'
import Results from './pages/Results'
import Dashboard from './pages/Dashboard'

function App() {
  const [page, setPage] = useState('bazi') // bazi, clusters, quiz, results, dashboard
  const [userBazi, setUserBazi] = useState(null)
  const [partnerBazi, setPartnerBazi] = useState(null)
  const [selectedCluster, setSelectedCluster] = useState(null)
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [dailyQuizzes, setDailyQuizzes] = useState(2)

  // Load quiz data from JSON
  const quizzes = QuizData.clusters

  const handleBaziSubmit = (baziData, isPartner = false) => {
    if (isPartner) {
      setPartnerBazi(baziData)
      setPage('clusters')
    } else {
      setUserBazi(baziData)
      setPage('bazi-partner')
    }
  }

  const handleQuizAnswer = (questionIndex, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [`${selectedCluster}_${questionIndex}`]: answer
    }))
  }

  const handleNextQuestion = () => {
    const clusterQuizzes = quizzes[selectedCluster]?.quizzes || []
    if (currentQuiz < clusterQuizzes.length - 1) {
      setCurrentQuiz(prev => prev + 1)
    } else {
      // Quiz completed
      setDailyQuizzes(prev => Math.max(0, prev - 1))
      setPage('results')
    }
  }

  const startQuiz = (clusterId) => {
    setSelectedCluster(clusterId)
    setCurrentQuiz(0)
    setQuizAnswers({})
    setPage('quiz')
  }

  return (
    <div className="app">
      {page === 'bazi' && (
        <BaziInput 
          onSubmit={(data) => handleBaziSubmit(data, false)}
          title="Dein Bazi"
        />
      )}
      
      {page === 'bazi-partner' && (
        <BaziInput 
          onSubmit={(data) => handleBaziSubmit(data, true)}
          title="Bazi deines Partners"
        />
      )}
      
      {page === 'clusters' && (
        <ClusterSelect 
          quizzes={quizzes}
          onSelect={startQuiz}
          dailyLimit={dailyQuizzes}
          onDashboard={() => setPage('dashboard')}
        />
      )}
      
      {page === 'quiz' && (
        <QuizSwipe 
          quiz={quizzes[selectedCluster]?.quizzes[currentQuiz]}
          quizIndex={currentQuiz}
          totalQuizzes={quizzes[selectedCluster]?.quizzes.length || 0}
          onAnswer={(answer) => handleQuizAnswer(currentQuiz, answer)}
          onNext={handleNextQuestion}
          bazi={userBazi}
          partnerBazi={partnerBazi}
        />
      )}
      
      {page === 'results' && (
        <Results 
          clusterId={selectedCluster}
          answers={quizAnswers}
          userBazi={userBazi}
          partnerBazi={partnerBazi}
          onContinue={() => {
            setCurrentQuiz(0)
            setQuizAnswers({})
            setPage('clusters')
          }}
        />
      )}
      
      {page === 'dashboard' && (
        <Dashboard 
          userBazi={userBazi}
          partnerBazi={partnerBazi}
          dailyQuizzes={dailyQuizzes}
          onQuiz={() => setPage('clusters')}
          onBack={() => setPage('clusters')}
        />
      )}
    </div>
  )
}

export default App
