import { useMemo } from 'react'
import './Results.css'

function Results({ clusterId, coupleAnswers, results, userBazi, partnerBazi, compatibility, onContinue }) {
  const clusterNames = {
    passion: 'Leidenschaft',
    stability: 'Stabilität',
    future: 'Zukunft',
    love: 'Liebe'
  }

  // Berechne Gesamtscore basierend auf Antwort-Paaren
  const summary = useMemo(() => {
    if (!results || results.length === 0) {
      return { 
        score: 0, 
        insight: 'Keine Antworten', 
        recommendation: '',
        harmony: 'unbekannt'
      }
    }

    // Zähle positive Paar-Kombinationen
    let positiveCount = 0
    let balancedCount = 0
    
    results.forEach(r => {
      const icon = r.icon || ''
      if (icon.includes('🌟') || icon.includes('💫') || icon.includes('🔥') || icon.includes('✨')) {
        positiveCount++
      }
      if (icon.includes('🌊') || icon.includes('⚖️') || icon.includes('🎯')) {
        balancedCount++
      }
    })

    const total = results.length
    const score = Math.round(((positiveCount * 1 + balancedCount * 0.7) / total) * 10)
    
    let insight, recommendation, harmony
    
    if (score >= 8) {
      insight = 'Ihr seid ein Traumteam!'
      recommendation = 'Genießt diese Harmonie – ihr versteht euch intuitiv.'
      harmony = 'exzellent'
    } else if (score >= 6) {
      insight = 'Ihr harmoniert gut!'
      recommendation = 'Kleine Anpassungen können eure Verbindung noch stärken.'
      harmony = 'stark'
    } else if (score >= 4) {
      insight = 'Ihr ergänzt euch!'
      recommendation = 'Akzeptiert eure Unterschiede und lernt voneinander.'
      harmony = 'mittel'
    } else {
      insight = 'Ihr seid unterschiedlich – das ist okay!'
      recommendation: 'Nutzt eure Verschiedenheit als Stärke.'
      harmony = 'entwicklungsfähig'
    }

    return { score: Math.min(10, score), insight, recommendation, harmony }
  }, [results])

  return (
    <div className="results-page">
      <div className="container">
        <header className="header fade-in">
          <div className="result-icon">
            {summary.harmony === 'exzellent' ? '🌟' : 
             summary.harmony === 'stark' ? '💫' : 
             summary.harmony === 'mittel' ? '🌱' : '💕'}
          </div>
          <h1>{clusterNames[clusterId] || clusterId}</h1>
        </header>

        {/* Bazi Kompatibilität */}
        {compatibility && (
          <div className="compatibility-card fade-in">
            <h3>🔮 Bazi-Kompatibilität</h3>
            <div className="compat-grid">
              <div className="compat-item">
                <span className="label">Elemente</span>
                <span className="value">{userBazi?.mainElement} + {partnerBazi?.mainElement}</span>
                <span className="detail">{compatibility.element.text}</span>
              </div>
              <div className="compat-item">
                <span className="label">Yin/Yang</span>
                <span className="value">{compatibility.yinYang.text}</span>
                <span className="detail">{compatibility.yinYang.tip}</span>
              </div>
            </div>
          </div>
        )}

        {/* Gesamtscore */}
        <div className="result-card fade-in">
          <div className="score-circle" style={{ '--score': summary.score * 36 }}>
            <span className="score-value">{summary.score}</span>
            <span className="score-label">von 10</span>
          </div>

          <h2 className="insight">{summary.insight}</h2>
          <p className="recommendation">{summary.recommendation}</p>
        </div>

        {/* Einzelne Fragen-Ergebnisse */}
        {results && results.length > 0 && (
          <div className="answers-section fade-in">
            <h3>Eure Antworten</h3>
            {results.map((r, i) => (
              <div key={i} className="answer-card">
                <div className="answer-header">
                  <span className="answer-icon">{r.icon}</span>
                  <span className="answer-title">{r.title_de}</span>
                </div>
                <p className="answer-desc">{r.description_de}</p>
                <div className="answer-tip">
                  💡 {r.tip_de}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="actions fade-in">
          <button className="btn btn-primary" onClick={onContinue}>
            Zurück zur Auswahl →
          </button>
          <button className="btn btn-secondary" onClick={() => window.location.reload()}>
            Neu starten
          </button>
        </div>
      </div>
    </div>
  )
}

export default Results
