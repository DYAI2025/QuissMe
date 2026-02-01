import { useState, useEffect } from 'react'
import QuizData from './data/quizzes_complete.json'
import './App.css'
import { calculateBazi, getElementCompatibility, getYinYangBalance, combineAnswerTypes } from './utils/bazi'

// Pages
import BaziInput from './pages/BaziInput'
import ClusterSelect from './pages/ClusterSelect'
import QuizSwipe from './pages/QuizSwipe'
import Results from './pages/Results'
import Dashboard from './pages/Dashboard'
import PairQuiz from './pages/PairQuiz'

function App() {
  const [page, setPage] = useState('bazi')
  const [userBazi, setUserBazi] = useState(null)
  const [partnerBazi, setPartnerBazi] = useState(null)
  const [selectedCluster, setSelectedCluster] = useState(null)
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [dailyQuizzes, setDailyQuizzes] = useState(3)
  
  // Paar-Quiz State
  const [coupleAnswers, setCoupleAnswers] = useState({})
  const [quizStep, setQuizStep] = useState('user') // 'user' oder 'partner'

  const quizzes = QuizData.clusters

  // Bazi berechnen beim Absenden
  const handleBaziSubmit = (data, isPartner = false) => {
    const bazi = calculateBazi(data.year, data.month, data.day, data.hour)
    
    if (isPartner) {
      setPartnerBazi(bazi)
      setPage('dashboard')
    } else {
      setUserBazi(bazi)
      setPage('bazi-partner')
    }
  }

  // Paar-Quiz starten
  const startPairQuiz = (clusterId) => {
    setSelectedCluster(clusterId)
    setCurrentQuiz(0)
    setCoupleAnswers({})
    setQuizStep('user')
    setPage('pair-quiz')
  }

  // Antwort speichern
  const handlePairAnswer = (questionIndex, answerType, isUser = true) => {
    const key = `${selectedCluster}_${questionIndex}`
    setCoupleAnswers(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [isUser ? 'user' : 'partner']: answerType
      }
    }))
  }

  // Zum nächsten Schritt/Frage
  const handleNextStep = () => {
    const clusterQuizzes = quizzes[selectedCluster]?.quizzes || []
    
    if (quizStep === 'user') {
      // Zum Partner wechseln
      setQuizStep('partner')
    } else {
      // Frage beantwortet, zur nächsten
      if (currentQuiz < clusterQuizzes.length - 1) {
        setCurrentQuiz(prev => prev + 1)
        setQuizStep('user')
      } else {
        // Quiz fertig
        setDailyQuizzes(prev => Math.max(0, prev - 1))
        setPage('results')
      }
    }
  }

  // Ergebnisse berechnen
  const calculateResults = () => {
    const results = []
    const clusterQuizzes = quizzes[selectedCluster]?.quizzes || []
    
    clusterQuizzes.forEach((quiz, index) => {
      const key = `${selectedCluster}_${index}`
      const answers = coupleAnswers[key]
      
      if (answers?.user && answers?.partner) {
        const pairResult = combineAnswerTypes(answers.user, answers.partner, quiz.result_pairs || {})
        results.push({
          quizId: quiz.id,
          quizName: quiz.name_de,
          question: quiz.question_de,
          userType: answers.user,
          partnerType: answers.partner,
          ...pairResult
        })
      }
    })
    
    return results
  }

  // Bazi-Kompatibilität
  const getBaziCompatibility = () => {
    if (!userBazi || !partnerBazi) return null
    
    const elementComp = getElementCompatibility(userBazi.mainElement, partnerBazi.mainElement)
    const yinYang = getYinYangBalance(userBazi, partnerBazi)
    
    return { element: elementComp, yinYang }
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
      
      {page === 'dashboard' && (
        <Dashboard 
          userBazi={userBazi}
          partnerBazi={partnerBazi}
          dailyQuizzes={dailyQuizzes}
          onQuiz={startPairQuiz}
          onBack={() => setPage('bazi')}
          compatibility={getBaziCompatibility()}
        />
      )}
      
      {page === 'pair-quiz' && (
        <PairQuiz
          quiz={quizzes[selectedCluster]?.quizzes[currentQuiz]}
          quizIndex={currentQuiz}
          totalQuizzes={quizzes[selectedCluster]?.quizzes.length || 0}
          step={quizStep}
          onAnswer={(type) => handlePairAnswer(currentQuiz, type, quizStep === 'user')}
          onNext={handleNextStep}
          clusterName={quizzes[selectedCluster]?.name_de}
        />
      )}
      
      {page === 'results' && (
        <Results 
          clusterId={selectedCluster}
          coupleAnswers={coupleAnswers}
          results={calculateResults()}
          userBazi={userBazi}
          partnerBazi={partnerBazi}
          compatibility={getBaziCompatibility()}
          onContinue={() => {
            setCurrentQuiz(0)
            setCoupleAnswers({})
            setPage('dashboard')
          }}
        />
      )}
    </div>
  )
}

export default App
