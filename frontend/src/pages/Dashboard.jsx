

function Dashboard({ userBazi, partnerBazi, dailyQuizzes, onQuiz, onBack }) {
  return (
    <div className="dashboard-page">
      <div className="container">
        <header className="header fade-in">
          <h1>💕 QuissMe</h1>
          <p className="tagline">Entdeckt euch gegenseitig neu</p>
        </header>

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
            <span className="stat-value">{userBazi ? '✓' : '○'}</span>
            <span className="stat-label">Bazi aktiv</span>
          </div>
        </div>

        {userBazi && partnerBazi && (
          <div className="couple-info fade-in">
            <h3>Euer Paar-Profil</h3>
            <div className="bazi-display">
              <div className="bazi-card">
                <span className="bazi-label">Du</span>
                <span className="bazi-year">{userBazi.year}</span>
              </div>
              <span className="heart-icon">💕</span>
              <div className="bazi-card">
                <span className="bazi-label">Partner</span>
                <span className="bazi-year">{partnerBazi.year}</span>
              </div>
            </div>
          </div>
        )}

        <div className="actions fade-in">
          <button className="btn btn-primary btn-large" onClick={onQuiz}>
            🎯 Quiz starten
          </button>
        </div>

        <div className="tips-section fade-in">
          <h3>💡 Beziehungstipps</h3>
          <p>„Kleine Gesten täglich stärken die große Liebe."</p>
        </div>

        <footer className="footer fade-in">
          <button className="back-link" onClick={onBack}>
            ← Zurück
          </button>
        </footer>
      </div>
    </div>
  )
}

export default Dashboard
