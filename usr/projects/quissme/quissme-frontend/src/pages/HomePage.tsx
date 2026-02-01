import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCoupleStore } from '../store/coupleStore';
import { useCouple } from '../api/hooks/useCouple';
import { useBuffs } from '../api/hooks/useBuffs';
import { useBuffStore } from '../store/buffStore';

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { couple, compatibility } = useCoupleStore();
  const { activeBuffs } = useBuffStore();
  const { getCouple, getCompatibility } = useCouple();
  const { getActiveBuffs } = useBuffs();

  useEffect(() => {
    const loadData = async () => {
      try {
        await getCouple();
        await getCompatibility();
        await getActiveBuffs();
      } catch (error) {
        console.error('Failed to load home data:', error);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05060A] to-[#0a0b12] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Willkommen, {user?.name}! 💕</h1>
          <p className="text-gray-400">Entdecke euch neu. Mit Spaß, nicht mit Vorwürfen.</p>
        </div>

        {/* Couple Info Card */}
        {couple && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Euer Profil</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Kompatibilität</p>
                <p className="text-3xl font-bold text-[#D6B25E]">
                  {compatibility?.compatibility_score || 0}%
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Element Harmonie</p>
                <p className="text-3xl font-bold text-[#D6B25E]">
                  {compatibility?.element_harmony_score || 0}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Active Buffs */}
        {activeBuffs.length > 0 && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">🌟 Aktive Buffs</h3>
            <div className="space-y-2">
              {activeBuffs.map((buff) => (
                <div key={buff.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white">{buff.buff_type}</span>
                  <span className="text-[#D6B25E] text-sm">{buff.effect_description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/quiz')}
            className="bg-gradient-to-r from-[#D6B25E] to-[#e8c76f] text-black font-bold py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-[#D6B25E]/50 transition"
          >
            🎯 Quiz starten
          </button>
          <button
            onClick={() => navigate('/challenges')}
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl border border-white/20 transition"
          >
            ⚡ Challenges
          </button>
        </div>
      </div>
    </div>
  );
};
