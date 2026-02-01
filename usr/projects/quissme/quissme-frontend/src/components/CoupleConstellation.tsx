// components/CoupleConstellation.tsx

import React, { useState } from 'react';
import { BaZiEngine, BirthData, CompatibilityResult } from '../system/BaZiEngine';

interface CoupleConstellationProps {
  partner1: BirthData;
  partner2: BirthData;
}

export const CoupleConstellation: React.FC<CoupleConstellationProps> = ({
  partner1,
  partner2
}) => {
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateCompatibility = () => {
    setLoading(true);
    try {
      const result = BaZiEngine.calculateCoupleCompatibility(partner1, partner2);
      setCompatibility(result);
    } catch (error) {
      console.error('Error calculating compatibility:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#D6B25E'; // Gold
    if (score >= 60) return '#9D84B7'; // Purple
    if (score >= 40) return '#4A90E2'; // Blue
    return '#E74C3C'; // Red
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return '🔥 Highly Compatible';
    if (score >= 60) return '💫 Good Compatibility';
    if (score >= 40) return '🌊 Moderate Compatibility';
    return '⚡ Unique Dynamic';
  };

  return (
    <div className="couple-constellation" style={styles.container}>
      <h2 style={styles.title}>💞 Couple Constellation</h2>

      <button 
        onClick={calculateCompatibility}
        disabled={loading}
        style={styles.button}
      >
        {loading ? 'Calculating...' : 'Calculate Compatibility'}
      </button>

      {compatibility && (
        <div style={styles.resultContainer}>
          {/* Compatibility Score */}
          <div style={styles.scoreSection}>
            <div style={{
              ...styles.scoreCircle,
              borderColor: getScoreColor(compatibility.compatibilityScore)
            }}>
              <span style={styles.scoreNumber}>
                {compatibility.compatibilityScore}%
              </span>
            </div>
            <p style={styles.scoreLabel}>
              {getScoreLabel(compatibility.compatibilityScore)}
            </p>
          </div>

          {/* Element Analysis */}
          <div style={styles.analysisSection}>
            <h3 style={styles.sectionTitle}>🌍 Element Analysis</h3>
            <div style={styles.elementGrid}>
              <div style={styles.elementCard}>
                <span style={styles.elementLabel}>Partner 1</span>
                <span style={styles.elementValue}>
                  {compatibility.elementAnalysis.p1Element}
                </span>
              </div>
              <div style={styles.elementCard}>
                <span style={styles.elementLabel}>Interaction</span>
                <span style={styles.elementValue}>
                  {compatibility.elementAnalysis.interaction}
                </span>
              </div>
              <div style={styles.elementCard}>
                <span style={styles.elementLabel}>Partner 2</span>
                <span style={styles.elementValue}>
                  {compatibility.elementAnalysis.p2Element}
                </span>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div style={styles.metricsSection}>
            <h3 style={styles.sectionTitle}>📊 Compatibility Metrics</h3>
            <div style={styles.metricRow}>
              <span>Element Harmony:</span>
              <div style={styles.metricBar}>
                <div style={{
                  ...styles.metricFill,
                  width: `${compatibility.elementHarmony}%`
                }} />
              </div>
              <span>{compatibility.elementHarmony}%</span>
            </div>
            <div style={styles.metricRow}>
              <span>Day Master Synergy:</span>
              <div style={styles.metricBar}>
                <div style={{
                  ...styles.metricFill,
                  width: `${compatibility.dayMasterSynergy}%`
                }} />
              </div>
              <span>{compatibility.dayMasterSynergy}%</span>
            </div>
          </div>

          {/* Prediction & Recommendation */}
          <div style={styles.predictionSection}>
            <h3 style={styles.sectionTitle}>🔮 Yearly Prediction</h3>
            <p style={styles.predictionText}>
              {compatibility.yearlyPrediction}
            </p>
            <p style={styles.recommendationText}>
              {compatibility.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    background: 'linear-gradient(135deg, #05060A 0%, #1a1a2e 100%)',
    borderRadius: '24px',
    border: '1px solid rgba(214, 178, 94, 0.2)',
    backdropFilter: 'blur(12px)',
    color: '#fff'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#D6B25E'
  },
  button: {
    padding: '12px 24px',
    background: '#D6B25E',
    color: '#05060A',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'all 0.3s ease'
  },
  resultContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px'
  },
  scoreSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '12px'
  },
  scoreCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: '4px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(214, 178, 94, 0.1)'
  },
  scoreNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#D6B25E'
  },
  scoreLabel: {
    fontSize: '18px',
    fontWeight: '600'
  },
  analysisSection: {
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '12px',
    color: '#D6B25E'
  },
  elementGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px'
  },
  elementCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '12px',
    background: 'rgba(214, 178, 94, 0.1)',
    borderRadius: '8px'
  },
  elementLabel: {
    fontSize: '12px',
    color: '#999',
    marginBottom: '4px'
  },
  elementValue: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#D6B25E'
  },
  metricsSection: {
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px'
  },
  metricRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    fontSize: '14px'
  },
  metricBar: {
    flex: 1,
    height: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  metricFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #D6B25E, #9D84B7)',
    transition: 'width 0.3s ease'
  },
  predictionSection: {
    padding: '16px',
    background: 'rgba(214, 178, 94, 0.1)',
    borderRadius: '12px',
    borderLeft: '4px solid #D6B25E'
  },
  predictionText: {
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '8px'
  },
  recommendationText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#D6B25E'
  }
};
