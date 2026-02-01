import './Dashboard.css'

function Dashboard({ userBazi, partnerBazi, dailyQuizzes, onQuiz, onBack, compatibility }) {
  const elementColors = {
    Wood: '#4CAF50',
    Fire: '#FF5722',
    Earth: '#795548',
    Metal: '#9E9E9E',
    Water: '#2196F3'
  }

  const elementIcons = {
    Wood: '🌳',
    Fire: '🔥',
    Earth: '🏔️',
    Metal: '⚔️',
    Water: '🌊'
  }

  const renderElement = (bazi, label) => {
    if (!bazi) return null
    const element = bazi.mainElement
    return (
      <div className="bazi-element">
        <span className="element-icon" style={{ color: elementColors[element] }}>
          {elementIcons[element]}
        </span>
        <span className="element-name">{element}</span>
        <span className="element-yinyang">{bazi.yinYang}</span>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <header className="header fade-in">
          <h1>💕 QuissMe</h1>
          <p className="tagline">Entdeckt euch gegenseitig neu</p>
        </header>

        {/* Stats */}
        <div className="stats-row fade-in">
          <div className="stat-card">
            <span className="stat-icon">🎯</span>
            <span className="stat-value">{dailyQuizzes}</span>
            <span className="stat-label">Quizze heute</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✨</span>
            <span className="stat-value">4</span>
            <span className="stat-label">Bereiche</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🔮</span>
            <span className="stat-value">✓</span>
            <span className="stat-label">Bazi aktiv</span>
          </div>
        </div>

        {/* Bazi Anzeige */}
        {userBazi && partnerBazi && (
          <div className="bazi-section fade-in">
            <h3>Eure Bazi-Energie</h3>
            
            <div className="couple-bazi">
              <div className="bazi-card user">
                <span className="bazi-label">👤 Du</span>
                <div className="pillars">
                  {userBazi.pillars.map((p, i) => (
                    <span key={i} className="pillar">
                      {p.gan}{p.zhi}
                    </span>
                  ))}
                </div>
                {renderElement(userBazi, 'Du')}
              </div>
              
              <div className="bazi-connector">
                <span className="heart-icon">💕</span>
                {compatibility && (
                  <span className="compat-badge">{compatibility.element.text}</span>
                )}
              </div>
              
              <div className="bazi-card partner">
                <span className="bazi-label">💕 Partner</span>
                <div className="pillars">
                  {partnerBazi.pillars.map((p, i) => (
                    <span key={i} className="pillar">
                      {p.gan}{p.zhi}
                    </span>
                  ))}
                </div>
                {renderElement(partnerBazi, 'Partner')}
              </div>
            </div>

            {/* Yin/Yang Balance */}
            {compatibility && (
              <div className="yin-yang-balance">
                <span className="yy-icon">
                  {compatibility.yinYang.balance === 'balanced' ? '☯️' : 
                   compatibility.yinYang.balance === 'double-yang' ? '⚡' : '🌙'}
                </span>
                <span>{compatibility.yinYang.text}</span>
              </div>
            )}
          </div>
        )}

        <div className="actions fade-in">
          <button 
            className="btn btn-primary btn-large" 
            onClick={onQuiz}
            disabled={dailyQuizzes === 0}
          >
            {dailyQuizzes > 0 ? '🎯 Quiz starten' : '🎉 Alle Quizze heute gemacht!'}
          </button>
        </div>

        <div className="tips-section fade-in">
          <h3>💡 Beziehungstipps</h3>
          <p>„Kleine Gesten täglich stärken die große Liebe."</p>
        </div>

        <footer className="footer fade-in">
          <button className="back-link" onClick={onBack}>
            ← Bazi neu eingeben
          </button>
        </footer>
      </div>
    </div>
  )
}

export default Dashboard
