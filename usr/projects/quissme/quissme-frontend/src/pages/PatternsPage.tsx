import { useEffect } from 'react';
import { usePatterns } from '../api/hooks/usePatterns';
import { usePatternStore } from '../store/patternStore';

export const PatternsPage = () => {
  const { getPatterns, analyzePatterns } = usePatterns();
  const { patterns, analysis } = usePatternStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        await getPatterns();
        await analyzePatterns();
      } catch (error) {
        console.error('Failed to load patterns:', error);
      }
    };
    loadData();
  }, []);

  const getPatternIcon = (patternType: string) => {
    const icons: Record<string, string> = {
      intimacy_drop: '💔',
      conflict_escalation: '⚡',
      routine_complacency: '😴',
      communication_gap: '🤐',
      trust_issue: '🔒',
    };
    return icons[patternType] || '📊';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05060A] to-[#0a0b12] p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">📊 Beziehungs-Muster</h1>

        {/* Analysis Summary */}
        {analysis && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">🔍 Analyse</h2>
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-gray-300 leading-relaxed">{analysis.summary}</p>
            </div>
          </div>
        )}

        {/* Detected Patterns */}
        {patterns.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Erkannte Muster</h2>
            <div className="space-y-4">
              {patterns.map((pattern) => (
                <div key={pattern.id} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getPatternIcon(pattern.pattern_type)}</span>
                      <div>
                        <h3 className="text-lg font-bold text-white capitalize">
                          {pattern.pattern_type.replace(/_/g, ' ')}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Erkannt: {new Date(pattern.triggered_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#D6B25E] font-bold">{Math.round(pattern.confidence * 100)}%</p>
                      <p className="text-gray-400 text-sm">Konfidenz</p>
                    </div>
                  </div>

                  {pattern.intervention_sent && (
                    <div className="bg-white/5 p-3 rounded-lg mb-4">
                      <p className="text-gray-300 text-sm">
                        <span className="font-semibold">💡 Vorschlag:</span> {pattern.intervention_sent}
                      </p>
                    </div>
                  )}

                  {pattern.user_response && (
                    <div className="text-gray-400 text-sm">
                      <span className="font-semibold">Eure Reaktion:</span> {pattern.user_response}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center">
            <p className="text-gray-400 text-lg">Noch keine Muster erkannt. Macht mehr Quizzes! 🎯</p>
          </div>
        )}
      </div>
    </div>
  );
};
