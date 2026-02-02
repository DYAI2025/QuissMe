/**
 * CompatibilityDisplay Component for QuissMe
 *
 * Displays comprehensive compatibility results combining BaZi and Western astrology
 * with a beautiful, modern UI following the app's dark cosmos + gold theme.
 */

import { useState } from 'react';
import './CompatibilityDisplay.css';

function CompatibilityDisplay({ result, userBazi, partnerBazi, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedAspect, setExpandedAspect] = useState(null);

  if (!result) {
    return (
      <div className="compat-loading">
        <div className="compat-spinner"></div>
        <p>Berechne Kompatibilitaet...</p>
      </div>
    );
  }

  const { overallScore, overallLabel_de, aspects, strengths, challenges, summary_de, baziOnly } = result;

  // Get score color based on value
  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--accent-stability)';
    if (score >= 65) return 'var(--gold-primary)';
    if (score >= 50) return 'var(--gold-dark)';
    return 'var(--accent-passion)';
  };

  // Get score label
  const getScoreLabel = (score) => {
    if (score >= 85) return 'Ausgezeichnet';
    if (score >= 75) return 'Sehr Gut';
    if (score >= 65) return 'Gut';
    if (score >= 50) return 'Moderat';
    return 'Herausfordernd';
  };

  // Filter aspects by source
  const baziAspects = aspects.filter(a => a.source === 'bazi');
  const westernAspects = aspects.filter(a => a.source === 'western');
  const combinedAspects = aspects.filter(a => a.source === 'combined');

  return (
    <div className="compat-display">
      {/* Header with overall score */}
      <div className="compat-header">
        <button className="compat-close" onClick={onClose}>
          <span>&#10005;</span>
        </button>

        <h2>Eure Kompatibilitaet</h2>

        {/* Score Circle */}
        <div className="score-circle-container">
          <svg className="score-circle" viewBox="0 0 120 120">
            <circle
              className="score-circle-bg"
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="var(--bg-card)"
              strokeWidth="12"
            />
            <circle
              className="score-circle-progress"
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={getScoreColor(overallScore)}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(overallScore / 100) * 339.292} 339.292`}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="score-value">
            <span className="score-number">{overallScore}</span>
            <span className="score-percent">%</span>
          </div>
        </div>

        <p className="score-label" style={{ color: getScoreColor(overallScore) }}>
          {overallLabel_de}
        </p>

        {baziOnly && (
          <div className="bazi-only-notice">
            <span className="notice-icon">&#9888;</span>
            <span>Nur BaZi-Daten verfuegbar. Fuer vollstaendige Analyse westliche Astrologie hinzufuegen.</span>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="compat-tabs">
        <button
          className={`compat-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="tab-icon">&#9733;</span>
          Uebersicht
        </button>
        <button
          className={`compat-tab ${activeTab === 'bazi' ? 'active' : ''}`}
          onClick={() => setActiveTab('bazi')}
        >
          <span className="tab-icon">&#9775;</span>
          BaZi
        </button>
        {!baziOnly && (
          <button
            className={`compat-tab ${activeTab === 'western' ? 'active' : ''}`}
            onClick={() => setActiveTab('western')}
          >
            <span className="tab-icon">&#9788;</span>
            Western
          </button>
        )}
        <button
          className={`compat-tab ${activeTab === 'tips' ? 'active' : ''}`}
          onClick={() => setActiveTab('tips')}
        >
          <span className="tab-icon">&#128161;</span>
          Tipps
        </button>
      </div>

      {/* Tab Content */}
      <div className="compat-content">

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content fade-in">
            {/* Summary */}
            <div className="compat-summary">
              <p>{summary_de}</p>
            </div>

            {/* All Aspects Overview */}
            <div className="aspects-overview">
              <h3>Alle Aspekte</h3>
              {aspects.map((aspect, index) => (
                <div
                  key={index}
                  className={`aspect-item ${expandedAspect === index ? 'expanded' : ''}`}
                  onClick={() => setExpandedAspect(expandedAspect === index ? null : index)}
                >
                  <div className="aspect-header">
                    <span className="aspect-icon">{aspect.icon}</span>
                    <span className="aspect-name">{aspect.name_de}</span>
                    <div className="aspect-score-bar">
                      <div
                        className="aspect-score-fill"
                        style={{
                          width: `${aspect.score}%`,
                          backgroundColor: getScoreColor(aspect.score)
                        }}
                      />
                    </div>
                    <span className="aspect-score-value">{aspect.score}%</span>
                    <span className="aspect-expand-icon">
                      {expandedAspect === index ? '\u25B2' : '\u25BC'}
                    </span>
                  </div>

                  {expandedAspect === index && (
                    <div className="aspect-details">
                      <p>{aspect.description_de}</p>
                      <span className="aspect-source">
                        Quelle: {aspect.source === 'bazi' ? 'BaZi' : aspect.source === 'western' ? 'Westlich' : 'Kombiniert'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BaZi Tab */}
        {activeTab === 'bazi' && (
          <div className="tab-content fade-in">
            <div className="bazi-section">
              <h3>&#9775; BaZi Element-Analyse</h3>

              {/* Element Display */}
              <div className="element-comparison">
                <div className="element-person">
                  <span className="person-label">Du</span>
                  <div className="element-badge" data-element={userBazi?.mainElement?.toLowerCase()}>
                    {getElementEmoji(userBazi?.mainElement)}
                    <span>{userBazi?.mainElement}</span>
                  </div>
                  <span className="yinyang-badge">{userBazi?.yinYang}</span>
                </div>

                <div className="element-connector">
                  <span className="connector-heart">&#10084;</span>
                </div>

                <div className="element-person">
                  <span className="person-label">Partner</span>
                  <div className="element-badge" data-element={partnerBazi?.mainElement?.toLowerCase()}>
                    {getElementEmoji(partnerBazi?.mainElement)}
                    <span>{partnerBazi?.mainElement}</span>
                  </div>
                  <span className="yinyang-badge">{partnerBazi?.yinYang}</span>
                </div>
              </div>

              {/* BaZi Aspects */}
              {baziAspects.map((aspect, index) => (
                <div key={index} className="bazi-aspect-card">
                  <div className="bazi-aspect-header">
                    <span className="bazi-aspect-icon">{aspect.icon}</span>
                    <h4>{aspect.name_de}</h4>
                  </div>
                  <div className="bazi-aspect-score">
                    <div className="circular-progress small" data-score={aspect.score}>
                      <span>{aspect.score}%</span>
                    </div>
                    <span className="score-label-small">{getScoreLabel(aspect.score)}</span>
                  </div>
                  <p className="bazi-aspect-desc">{aspect.description_de}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Western Tab */}
        {activeTab === 'western' && !baziOnly && (
          <div className="tab-content fade-in">
            <div className="western-section">
              <h3>&#9788; Westliche Astrologie</h3>

              {westernAspects.length > 0 ? (
                westernAspects.map((aspect, index) => (
                  <div key={index} className="western-aspect-card">
                    <div className="western-aspect-header">
                      <span className="western-aspect-icon">{aspect.icon}</span>
                      <h4>{aspect.name_de}</h4>
                    </div>
                    <div className="western-aspect-score">
                      <div className="circular-progress small" data-score={aspect.score}>
                        <span>{aspect.score}%</span>
                      </div>
                      <span className="score-label-small">{getScoreLabel(aspect.score)}</span>
                    </div>
                    <p className="western-aspect-desc">{aspect.description_de}</p>
                  </div>
                ))
              ) : (
                <div className="no-data-notice">
                  <span className="notice-icon">&#9888;</span>
                  <p>Keine westlichen Astrologie-Daten verfuegbar.</p>
                  <p className="notice-hint">Fuege Sonnen-, Mond- und Planetenzeichen hinzu fuer vollstaendige Analyse.</p>
                </div>
              )}

              {/* Combined Aspects */}
              {combinedAspects.length > 0 && (
                <>
                  <h3 style={{ marginTop: '24px' }}>&#127775; Kombinierte Analyse</h3>
                  {combinedAspects.map((aspect, index) => (
                    <div key={index} className="western-aspect-card combined">
                      <div className="western-aspect-header">
                        <span className="western-aspect-icon">{aspect.icon}</span>
                        <h4>{aspect.name_de}</h4>
                      </div>
                      <div className="western-aspect-score">
                        <div className="circular-progress small" data-score={aspect.score}>
                          <span>{aspect.score}%</span>
                        </div>
                        <span className="score-label-small">{getScoreLabel(aspect.score)}</span>
                      </div>
                      <p className="western-aspect-desc">{aspect.description_de}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <div className="tab-content fade-in">
            {/* Strengths */}
            {strengths.length > 0 && (
              <div className="tips-section strengths">
                <h3>&#127775; Eure Staerken</h3>
                {strengths.map((strength, index) => (
                  <div key={index} className="tip-card strength">
                    <span className="tip-icon">{strength.icon}</span>
                    <div className="tip-content">
                      <h4>{strength.title_de}</h4>
                      <p>{strength.description_de}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Challenges */}
            {challenges.length > 0 && (
              <div className="tips-section challenges">
                <h3>&#128170; Wachstumsbereiche</h3>
                {challenges.map((challenge, index) => (
                  <div key={index} className="tip-card challenge">
                    <span className="tip-icon">{challenge.icon}</span>
                    <div className="tip-content">
                      <h4>{challenge.title_de}</h4>
                      <p>{challenge.description_de}</p>
                      <div className="challenge-tip">
                        <span className="tip-label">&#128161; Tipp:</span>
                        <span>{challenge.tip_de}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* General Tips */}
            <div className="tips-section general">
              <h3>&#128173; Allgemeine Tipps</h3>
              <div className="general-tips">
                <div className="general-tip">
                  <span className="tip-number">1</span>
                  <p>Kommuniziert offen ueber eure unterschiedlichen Beduerfnisse und Energien.</p>
                </div>
                <div className="general-tip">
                  <span className="tip-number">2</span>
                  <p>Nutzt eure Staerken, um die Herausforderungen des anderen auszugleichen.</p>
                </div>
                <div className="general-tip">
                  <span className="tip-number">3</span>
                  <p>Seht Unterschiede als Bereicherung, nicht als Hindernis.</p>
                </div>
                <div className="general-tip">
                  <span className="tip-number">4</span>
                  <p>Plant regelmaessige "Energie-Check-ins" um im Gleichgewicht zu bleiben.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function for element emojis
function getElementEmoji(element) {
  const emojis = {
    Wood: '🌳',
    Fire: '🔥',
    Earth: '🏔️',
    Metal: '⚔️',
    Water: '🌊'
  };
  return emojis[element] || '✨';
}

export default CompatibilityDisplay;
