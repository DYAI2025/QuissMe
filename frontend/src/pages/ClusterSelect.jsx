

function ClusterSelect({ quizzes, onSelect, dailyLimit, onDashboard }) {
  const clusterInfo = {
    passion: { 
      icon: '🔥', 
      name: 'Leidenschaft', 
      color: '#FF6B6B',
      buff: 'Leidenschafts-Boost'
    },
    stability: { 
      icon: '⚓', 
      name: 'Stabilität', 
      color: '#4ECDC4',
      buff: 'Fels in der Brandung'
    },
    future: { 
      icon: '🔮', 
      name: 'Zukunft', 
      color: '#9B59B6',
      buff: 'Future-Forward'
    },
    love: {
      icon: '💕',
      name: 'Liebe',
      color: '#FF69B4',
      buff: 'Liebesflüsterer'
    }
  }

  return (
    <div className="cluster-select-page">
      <div className="container">
        <header className="header fade-in">
          <button className="back-btn" onClick={onDashboard}>
            ← Dashboard
          </button>
          <h1>💕 QuissMe</h1>
          <p>Wähle einen Bereich für heute</p>
          
          <div className="daily-limit">
            <span className="limit-number">{dailyLimit}</span>
            <span className="limit-text">Quizze übrig</span>
          </div>
        </header>

        <div className="clusters-grid fade-in">
          {Object.entries(quizzes).map(([key, cluster]) => {
            const info = clusterInfo[key] || { icon: '📦', name: key, color: '#666', buff: '' }
            return (
              <div 
                key={key}
                className="cluster-card"
                style={{ '--cluster-color': info.color }}
                onClick={() => dailyLimit > 0 && onSelect(key)}
              >
                <div className="cluster-icon">{info.icon}</div>
                <h3>{cluster.name_de || info.name}</h3>
                <p className="cluster-buff">🎁 {info.buff}</p>
                <div className="cluster-progress">
                  <span>{cluster.quiz_count} Quizze</span>
                </div>
              </div>
            )
          })}
        </div>

        {dailyLimit === 0 && (
          <div className="limit-reached fade-in">
            <p>🎉 Du hast alle Quizze für heute gemacht!</p>
            <p>Komm morgen wieder für neue Quizze!</p>
          </div>
        )}

        <footer className="footer fade-in">
          <p>💡 Tipp: Bazi-Power-Ups geben dir +1 Quiz pro Tag!</p>
        </footer>
      </div>
    </div>
  )
}

export default ClusterSelect
