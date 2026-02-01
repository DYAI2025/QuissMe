// quiz/LoveLanguages.tsx

import React, { useState } from 'react';

export type LoveLanguage = 
  | 'Words of Affirmation'
  | 'Acts of Service'
  | 'Receiving Gifts'
  | 'Quality Time'
  | 'Physical Touch';

export interface QuizQuestion {
  id: string;
  text: string;
  options: Array<{
    text: string;
    language: LoveLanguage;
  }>;
}

export interface QuizResult {
  language: LoveLanguage;
  score: number;
  description: string;
  icon: string;
}

const LOVE_LANGUAGE_QUIZZES: Record<LoveLanguage, QuizQuestion[]> = {
  'Words of Affirmation': [
    {
      id: 'wa-1',
      text: 'When you're feeling down, what helps most?',
      options: [
        { text: 'Hearing "I love you" and why', language: 'Words of Affirmation' },
        { text: 'Someone helping with tasks', language: 'Acts of Service' },
        { text: 'A thoughtful gift', language: 'Receiving Gifts' },
        { text: 'Spending time together', language: 'Quality Time' },
        { text: 'A hug or physical comfort', language: 'Physical Touch' }
      ]
    },
    {
      id: 'wa-2',
      text: 'How do you best show appreciation?',
      options: [
        { text: 'Tell them specific compliments', language: 'Words of Affirmation' },
        { text: 'Do something helpful for them', language: 'Acts of Service' },
        { text: 'Give them a meaningful gift', language: 'Receiving Gifts' },
        { text: 'Spend quality time together', language: 'Quality Time' },
        { text: 'Show physical affection', language: 'Physical Touch' }
      ]
    },
    {
      id: 'wa-3',
      text: 'What hurts most in a relationship?',
      options: [
        { text: 'Being criticized or ignored', language: 'Words of Affirmation' },
        { text: 'Not being helped when needed', language: 'Acts of Service' },
        { text: 'Feeling forgotten', language: 'Receiving Gifts' },
        { text: 'Not having time together', language: 'Quality Time' },
        { text: 'Lack of physical closeness', language: 'Physical Touch' }
      ]
    }
  ],
  'Acts of Service': [
    {
      id: 'as-1',
      text: 'What makes you feel most loved?',
      options: [
        { text: 'Hearing loving words', language: 'Words of Affirmation' },
        { text: 'Partner handling tasks for me', language: 'Acts of Service' },
        { text: 'Receiving thoughtful gifts', language: 'Receiving Gifts' },
        { text: 'Undivided attention', language: 'Quality Time' },
        { text: 'Physical intimacy', language: 'Physical Touch' }
      ]
    },
    {
      id: 'as-2',
      text: 'Your ideal partner would...',
      options: [
        { text: 'Say sweet things regularly', language: 'Words of Affirmation' },
        { text: 'Help with household tasks', language: 'Acts of Service' },
        { text: 'Surprise with gifts', language: 'Receiving Gifts' },
        { text: 'Plan special dates', language: 'Quality Time' },
        { text: 'Be physically affectionate', language: 'Physical Touch' }
      ]
    },
    {
      id: 'as-3',
      text: 'When stressed, you need...',
      options: [
        { text: 'Reassuring words', language: 'Words of Affirmation' },
        { text: 'Help with responsibilities', language: 'Acts of Service' },
        { text: 'A special treat', language: 'Receiving Gifts' },
        { text: 'Focused attention', language: 'Quality Time' },
        { text: 'A comforting touch', language: 'Physical Touch' }
      ]
    }
  ],
  'Receiving Gifts': [
    {
      id: 'rg-1',
      text: 'What makes a gift meaningful?',
      options: [
        { text: 'The words that come with it', language: 'Words of Affirmation' },
        { text: 'The effort put into it', language: 'Acts of Service' },
        { text: 'The thoughtfulness behind it', language: 'Receiving Gifts' },
        { text: 'The time spent choosing it', language: 'Quality Time' },
        { text: 'How it's presented', language: 'Physical Touch' }
      ]
    },
    {
      id: 'rg-2',
      text: 'Your favorite gift would be...',
      options: [
        { text: 'A heartfelt letter', language: 'Words of Affirmation' },
        { text: 'Something they made', language: 'Acts of Service' },
        { text: 'Something they chose just for me', language: 'Receiving Gifts' },
        { text: 'An experience together', language: 'Quality Time' },
        { text: 'Something luxurious to enjoy', language: 'Physical Touch' }
      ]
    },
    {
      id: 'rg-3',
      text: 'Gifts matter because...',
      options: [
        { text: 'They show they care', language: 'Words of Affirmation' },
        { text: 'They show effort', language: 'Acts of Service' },
        { text: 'They're tangible symbols of love', language: 'Receiving Gifts' },
        { text: 'They create memories', language: 'Quality Time' },
        { text: 'They feel good to receive', language: 'Physical Touch' }
      ]
    }
  ],
  'Quality Time': [
    {
      id: 'qt-1',
      text: 'Your ideal date night is...',
      options: [
        { text: 'Deep conversations', language: 'Words of Affirmation' },
        { text: 'Doing something together', language: 'Acts of Service' },
        { text: 'Going somewhere special', language: 'Receiving Gifts' },
        { text: 'Just being together', language: 'Quality Time' },
        { text: 'Physical closeness', language: 'Physical Touch' }
      ]
    },
    {
      id: 'qt-2',
      text: 'What hurts most?',
      options: [
        { text: 'Being told you're not important', language: 'Words of Affirmation' },
        { text: 'Being left to handle things alone', language: 'Acts of Service' },
        { text: 'Being forgotten', language: 'Receiving Gifts' },
        { text: 'Not having time together', language: 'Quality Time' },
        { text: 'Physical distance', language: 'Physical Touch' }
      ]
    },
    {
      id: 'qt-3',
      text: 'You feel closest when...',
      options: [
        { text: 'They say loving things', language: 'Words of Affirmation' },
        { text: 'They help you', language: 'Acts of Service' },
        { text: 'They give you something', language: 'Receiving Gifts' },
        { text: 'You're together without distractions', language: 'Quality Time' },
        { text: 'You're physically close', language: 'Physical Touch' }
      ]
    }
  ],
  'Physical Touch': [
    {
      id: 'pt-1',
      text: 'Physical affection means...',
      options: [
        { text: 'They care about me', language: 'Words of Affirmation' },
        { text: 'They're there for me', language: 'Acts of Service' },
        { text: 'They value me', language: 'Receiving Gifts' },
        { text: 'We're connected', language: 'Quality Time' },
        { text: 'Everything', language: 'Physical Touch' }
      ]
    },
    {
      id: 'pt-2',
      text: 'You need physical touch...',
      options: [
        { text: 'To hear it's okay', language: 'Words of Affirmation' },
        { text: 'To feel supported', language: 'Acts of Service' },
        { text: 'To feel valued', language: 'Receiving Gifts' },
        { text: 'To feel connected', language: 'Quality Time' },
        { text: 'Regularly to feel loved', language: 'Physical Touch' }
      ]
    },
    {
      id: 'pt-3',
      text: 'Without physical affection, you feel...',
      options: [
        { text: 'Unappreciated', language: 'Words of Affirmation' },
        { text: 'Unsupported', language: 'Acts of Service' },
        { text: 'Forgotten', language: 'Receiving Gifts' },
        { text: 'Disconnected', language: 'Quality Time' },
        { text: 'Unloved', language: 'Physical Touch' }
      ]
    }
  ]
};

const LANGUAGE_DESCRIPTIONS: Record<LoveLanguage, { description: string; icon: string }> = {
  'Words of Affirmation': {
    description: 'You feel most loved through verbal expressions of appreciation, compliments, and affirmation.',
    icon: '💬'
  },
  'Acts of Service': {
    description: 'You feel most loved when your partner helps you and makes your life easier.',
    icon: '🤝'
  },
  'Receiving Gifts': {
    description: 'You feel most loved through thoughtful gifts that show your partner was thinking of you.',
    icon: '🎁'
  },
  'Quality Time': {
    description: 'You feel most loved through undivided attention and meaningful time together.',
    icon: '⏰'
  },
  'Physical Touch': {
    description: 'You feel most loved through physical affection and closeness.',
    icon: '💕'
  }
};

interface LoveLanguagesQuizProps {
  onComplete?: (result: QuizResult) => void;
}

export const LoveLanguagesQuiz: React.FC<LoveLanguagesQuizProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<LoveLanguage, number>>({
    'Words of Affirmation': 0,
    'Acts of Service': 0,
    'Receiving Gifts': 0,
    'Quality Time': 0,
    'Physical Touch': 0
  });
  const [completed, setCompleted] = useState(false);

  const allQuestions = Object.values(LOVE_LANGUAGE_QUIZZES).flat();
  const currentQuestion = allQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;

  const handleAnswer = (language: LoveLanguage) => {
    const newScores = { ...scores };
    newScores[language] += 1;
    setScores(newScores);

    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCompleted(true);
      const topLanguage = Object.entries(newScores).sort(
        ([, a], [, b]) => b - a
      )[0][0] as LoveLanguage;

      const result: QuizResult = {
        language: topLanguage,
        score: newScores[topLanguage],
        description: LANGUAGE_DESCRIPTIONS[topLanguage].description,
        icon: LANGUAGE_DESCRIPTIONS[topLanguage].icon
      };

      onComplete?.(result);
    }
  };

  if (completed) {
    const topLanguage = Object.entries(scores).sort(
      ([, a], [, b]) => b - a
    )[0][0] as LoveLanguage;
    const desc = LANGUAGE_DESCRIPTIONS[topLanguage];

    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Your Love Language</h2>
        <div style={styles.resultCard}>
          <span style={styles.resultIcon}>{desc.icon}</span>
          <h3 style={styles.resultLanguage}>{topLanguage}</h3>
          <p style={styles.resultDescription}>{desc.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
      </div>
      <p style={styles.progressText}>
        Question {currentQuestionIndex + 1} of {allQuestions.length}
      </p>

      <h3 style={styles.questionText}>{currentQuestion.text}</h3>

      <div style={styles.optionsContainer}>
        {currentQuestion.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(option.language)}
            style={styles.optionButton}
          >
            {option.text}
          </button>
        ))}
      </div>
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
  progressBar: {
    height: '4px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '2px',
    marginBottom: '16px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #D6B25E, #9D84B7)',
    transition: 'width 0.3s ease'
  },
  progressText: {
    fontSize: '12px',
    color: '#999',
    marginBottom: '16px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#D6B25E'
  },
  questionText: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
    lineHeight: '1.4'
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px'
  },
  optionButton: {
    padding: '16px',
    background: 'rgba(214, 178, 94, 0.1)',
    border: '1px solid rgba(214, 178, 94, 0.3)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'left' as const
  },
  resultCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '32px',
    background: 'rgba(214, 178, 94, 0.1)',
    borderRadius: '16px',
    border: '2px solid #D6B25E'
  },
  resultIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  resultLanguage: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#D6B25E',
    marginBottom: '12px'
  },
  resultDescription: {
    fontSize: '14px',
    lineHeight: '1.6',
    textAlign: 'center' as const,
    color: '#ccc'
  }
};
