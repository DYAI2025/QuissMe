// src/App.tsx

import React, { useState } from 'react';
import { CoupleConstellation } from './components/CoupleConstellation';
import { LoveLanguagesQuiz } from './quiz/LoveLanguages';
import { useBuffStore, createBuff } from './system/BuffSystem';
import type { BirthData } from './types';

type AppView = 'home' | 'constellation' | 'quiz' | 'buffs';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [partner1, setPartner1] = useState<BirthData | null>(null);
  const [partner2, setPartner2] = useState<BirthData | null>(null);
  const { activeBuffs, addBuff, getActiveBuffs } = useBuffStore();

  const handleQuizComplete = () => {
    // Add a random buff when quiz is completed
    const buffTypes = [
      'Liebesflüsterer',
      'Harmonie-Welle',
      'Neugier-Funkeln',
      'Intimitäts-Boost'
    ] as const;
    const randomBuff = buffTypes[Math.floor(Math.random() * buffTypes.length)];
    addBuff(createBuff(randomBuff));
    setCurrentView('buffs');
  };

  const handleSetPartner1 = (data: BirthData) => {
    setPartner1(data);
  };

  const handleSetPartner2 = (data: BirthData) => {
    setPartner2(data);
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.logo}>💞 QuissMe</h1>
        <p style={styles.tagline}>Entertainment first. Connection always.</p>
      </header>

      <nav style={styles.nav}>
        <button
          onClick={() => setCurrentView('home')}
          style={{
            ...styles.navButton,
            ...(currentView === 'home' ? styles.navButtonActive : {})
          }}
        >
          🏠 Home
        </button>
        <button
          onClick={() => setCurrentView('constellation')}
          style={{
            ...styles.navButton,
            ...(currentView === 'constellation' ? styles.navButtonActive : {})
          }}
        >
          🌟 Constellation
        </button>
        <button
          onClick={() => setCurrentView('quiz')}
          style={{
            ...styles.navButton,
            ...(currentView === 'quiz' ? styles.navButtonActive : {})
          }}
        >
          🎯 Quiz
        </button>
        <button
          onClick={() => setCurrentView('buffs')}
          style={{
            ...styles.navButton,
            ...(currentView === 'buffs' ? styles.navButtonActive : {})
          }}
        >
          ✨ Buffs
        </button>
      </nav>

      <main style={styles.main}>
        {currentView === 'home' && (
          <div style={styles.content}>
            <h2 style={styles.sectionTitle}>Welcome to QuissMe</h2>
            <p style={styles.description}>
              Discover your relationship through fun quizzes, astrology compatibility,
              and playful challenges designed to strengthen your bond.
            </p>
            <div style={styles.featureGrid}>
              <div style={styles.featureCard}>
                <span style={styles.featureIcon}>🌍</span>
                <h3>Couple Constellation</h3>
                <p>Explore your astrological compatibility through BaZi calculations</p>
              </div>
              <div style={styles.featureCard}>
                <span style={styles.featureIcon}>💬</span>
                <h3>Love Languages</h3>
                <p>Discover how you and your partner express and receive love</p>
              </div>
              <div style={styles.featureCard}>
                <span style={styles.featureIcon}>✨</span>
                <h3>Buff System</h3>
                <p>Earn temporary boosts to enhance your relationship</p>
              </div>
            </div>
          </div>
        )}

        {currentView === 'constellation' && (
          <div style={styles.content}>
            <h2 style={styles.sectionTitle}>Couple Constellation</h2>
            {partner1 && partner2 ? (
              <CoupleConstellation partner1={partner1} partner2={partner2} />
            ) : (
              <div style={styles.placeholder}>
                <p>Enter both partners' birth data to calculate compatibility</p>
                <div style={styles.birthDataForm}>
                  <div style={styles.formSection}>
                    <h3>Partner 1</h3>
                    <input
                      type="number"
                      placeholder="Year"
                      onChange={(e) =>
                        handleSetPartner1({
                          ...partner1 || { year: 1990, month: 1, day: 1, hour: 12, location: 'Earth' },
                          year: parseInt(e.target.value)
                        })
                      }
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formSection}>
                    <h3>Partner 2</h3>
                    <input
                      type="number"
                      placeholder="Year"
                      onChange={(e) =>
                        handleSetPartner2({
                          ...partner2 || { year: 1992, month: 6, day: 15, hour: 14, location: 'Earth' },
                          year: parseInt(e.target.value)
                        })
                      }
                      style={styles.input}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'quiz' && (
          <div style={styles.content}>
            <h2 style={styles.sectionTitle}>Love Languages Quiz</h2>
            <LoveLanguagesQuiz onComplete={handleQuizComplete} />
          </div>
        )}

        {currentView === 'buffs' && (
          <div style={styles.content}>
            <h2 style={styles.sectionTitle}>Active Buffs</h2>
            <div style={styles.buffsContainer}>
              {getActiveBuffs().length > 0 ? (
                getActiveBuffs().map((buff) => (
                  <div key={buff.id} style={styles.buffCard}>
                    <span style={styles.buffIcon}>{buff.icon}</span>
                    <div style={styles.buffInfo}>
                      <h3 style={styles.buffName}>{buff.type}</h3>
                      <p style={styles.buffEffect}>{buff.effect}</p>
                      <p style={styles.buffExpiry}>
                        Expires: {buff.expiryDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={styles.noBuffs}>No active buffs. Complete quizzes to earn buffs!</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #05060A 0%, #1a1a2e 100%)',
    color: '#fff',
    fontFamily: 'Sora, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  header: {
    padding: '32px 24px',
    textAlign: 'center' as const,
    borderBottom: '1px solid rgba(214, 178, 94, 0.2)'
  },
  logo: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#D6B25E',
    margin: '0 0 8px 0'
  },
  tagline: {
    fontSize: '14px',
    color: '#999',
    margin: 0
  },
  nav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    padding: '16px 24px',
    borderBottom: '1px solid rgba(214, 178, 94, 0.1)',
    flexWrap: 'wrap' as const
  },
  navButton: {
    padding: '8px 16px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(214, 178, 94, 0.2)',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease'
  },
  navButtonActive: {
    background: '#D6B25E',
    color: '#05060A',
    borderColor: '#D6B25E'
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px'
  },
  content: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px'
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#D6B25E',
    margin: 0
  },
  description: {
    fontSize: '16px',
    color: '#ccc',
    lineHeight: '1.6'
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px'
  },
  featureCard: {
    padding: '24px',
    background: 'rgba(214, 178, 94, 0.1)',
    borderRadius: '16px',
    border: '1px solid rgba(214, 178, 94, 0.2)',
    textAlign: 'center' as const
  },
  featureIcon: {
    fontSize: '32px',
    display: 'block',
    marginBottom: '12px'
  },
  placeholder: {
    padding: '32px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    textAlign: 'center' as const
  },
  birthDataForm: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginTop: '16px'
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px'
  },
  input: {
    padding: '8px 12px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(214, 178, 94, 0.3)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px'
  },
  buffsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px'
  },
  buffCard: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    background: 'rgba(214, 178, 94, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(214, 178, 94, 0.3)'
  },
  buffIcon: {
    fontSize: '32px',
    display: 'flex',
    alignItems: 'center'
  },
  buffInfo: {
    flex: 1
  },
  buffName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#D6B25E',
    margin: '0 0 4px 0'
  },
  buffEffect: {
    fontSize: '14px',
    color: '#ccc',
    margin: '0 0 4px 0'
  },
  buffExpiry: {
    fontSize: '12px',
    color: '#999',
    margin: 0
  },
  noBuffs: {
    textAlign: 'center' as const,
    color: '#999',
    padding: '32px'
  }
};

export default App;
