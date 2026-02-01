import { useEffect } from 'react';
import { useChallenges } from '../api/hooks/useChallenges';
import { useChallengeStore } from '../store/challengeStore';

export const ChallengesPage = () => {
  const { getRecommended, startChallenge, completeChallenge, getActive, getCompleted } = useChallenges();
  const { recommended, active, completed } = useChallengeStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        await getRecommended();
        await getActive();
        await getCompleted();
      } catch (error) {
        console.error('Failed to load challenges:', error);
      }
    };
    loadData();
  }, []);

  const handleStartChallenge = async (challengeId: string) => {
    try {
      await startChallenge(challengeId);
      await getActive();
    } catch (error) {
      console.error('Failed to start challenge:', error);
    }
  };

  const handleCompleteChallenge = async (challengeId: string) => {
    try {
      await completeChallenge(challengeId);
      await getActive();
      await getCompleted();
    } catch (error) {
      console.error('Failed to complete challenge:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05060A] to-[#0a0b12] p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">⚡ Challenges</h1>

        {/* Recommended Challenges */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">🌟 Empfohlen für euch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommended.map((challenge) => (
              <div key={challenge.id} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-2">{challenge.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{challenge.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#D6B25E] text-sm">{challenge.duration}</span>
                  <span className="text-gray-500 text-sm">{challenge.difficulty}</span>
                </div>
                <button
                  onClick={() => handleStartChallenge(challenge.id)}
                  className="w-full bg-gradient-to-r from-[#D6B25E] to-[#e8c76f] text-black font-bold py-2 px-4 rounded-lg hover:shadow-lg hover:shadow-[#D6B25E]/50 transition"
                >
                  Starten
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Challenges */}
        {active.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">🔥 Aktiv</h2>
            <div className="space-y-4">
              {active.map((challenge) => (
                <div key={challenge.id} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-[#D6B25E]/50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">Challenge #{challenge.challenge_id}</h3>
                      <p className="text-gray-400 text-sm">Gestartet: {new Date(challenge.started_at || '').toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => handleCompleteChallenge(challenge.id)}
                      className="bg-gradient-to-r from-[#D6B25E] to-[#e8c76f] text-black font-bold py-2 px-4 rounded-lg hover:shadow-lg hover:shadow-[#D6B25E]/50 transition"
                    >
                      Abschließen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Challenges */}
        {completed.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">✓ Abgeschlossen</h2>
            <div className="space-y-2">
              {completed.map((challenge) => (
                <div key={challenge.id} className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Challenge #{challenge.challenge_id}</span>
                    <span className="text-[#D6B25E]">⭐ {challenge.feedback_rating || 0}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
