import { useMemo } from 'react'


function Results({ clusterId, answers, userBazi, partnerBazi, onContinue }) {
  const clusterNames = {
    passion: 'Leidenschaft',
    stability: 'Stabilität',
    future: 'Zukunft',
    love: 'Liebe'
  }

  const result = useMemo(() => {
    const answersList = Object.values(answers)
    if (answersList.length === 0) return { score: 0, insight: 'Keine Antworten', recommendation: '' }

    const avgScore = answersList.reduce((sum, a) => sum + (a.score || 0), 0) / answersList.length
    
    let insight, recommendation, icon
    
    if (avgScore >= 8) {
      insight = 'Ihr seid ein Traumteam!'
      recommendation = 'Genießt diese Harmonie und lasst es euch gut gehen.'
      icon = '🌟'
    } else if (avgScore >= 6) {
      insight = 'Ihr versteht euch gut!'
      recommendation = 'Kleine Aufmerksamkeiten machen eure Beziehung noch stärker.'
      icon = '💫'
    } else if (avgScore >= 4) {
      insight = 'Es gibt Raum für Wachstum.'
      recommendation = 'Sprecht offen über eure Bedürfnisse und Wünsche.'
      icon = '🌱'
    } else {
      insight = 'Zeit für ein Date!'
      recommendation = 'Plant quality time together – das stärkt die Verbindung.'
      icon = '💕'
    }

    return { score: Math.round(avgScore * 10) / 10, insight, recommendation, icon }
  }, [answers])

  return (
    <div className="results-page">
      <div className="container">
        <header className="header fade-in">
          <div className="result-icon">{result.icon}</div>
          <h1>{clusterNames[clusterId] || clusterId}</h1>
        </header>

        <div className="result-card fade-in">
          <div className="score-circle">
            <span className="score-value">{result.score}</span>
            <span className="score-label">von 10</span>
          </div>

          <h2 className="insight">{result.insight}</h2>
          <p className="recommendation">{result.recommendation}</p>

          {userBazi && partnerBazi && (
            <div className="bazi-insight">
              <h3>🔮 Bazi-Insight</h3>
              <p>
                Mit euren Bazi-Konstellationen habt ihr in diesem Bereich 
                besondere Potenziale. Die Kombination aus {userBazi.year}- und 
                {partnerBazi.year}-Energie verstärkt eure natürliche Harmonie.
              </p>
            </div>
          )}
        </div>

        <div className="actions fade-in">
          <button className="btn btn-primary" onClick={onContinue}>
            Weiter zu den Quizzen →
          </button>
          <button className="btn btn-secondary" onClick={() => window.location.reload()}>
            Zurück zum Start
          </button>
        </div>
      </div>
    </div>
  )
}

export default Results
