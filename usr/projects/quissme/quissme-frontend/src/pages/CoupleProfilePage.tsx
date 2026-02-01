import { useEffect } from 'react';
import { useCouple } from '../api/hooks/useCouple';
import { useCoupleStore } from '../store/coupleStore';

export const CoupleProfilePage = () => {
  const { getCouple, getCompatibility } = useCouple();
  const { couple, compatibility } = useCoupleStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        await getCouple();
        await getCompatibility();
      } catch (error) {
        console.error('Failed to load couple data:', error);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05060A] to-[#0a0b12] p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">💞 Euer Profil</h1>

        {couple && (
          <div className="space-y-6">
            {/* Couple Info */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Beziehungsinformationen</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Partner 1</p>
                  <p className="text-xl font-semibold text-white">{couple.user1_name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Partner 2</p>
                  <p className="text-xl font-semibold text-white">{couple.user2_name}</p>
                </div>
              </div>
            </div>

            {/* Compatibility Analysis */}
            {compatibility && (
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">🌟 Kompatibilität</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-2">Gesamt Score</p>
                    <p className="text-3xl font-bold text-[#D6B25E]">
                      {compatibility.compatibility_score}%
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-2">Element Harmonie</p>
                    <p className="text-3xl font-bold text-[#D6B25E]">
                      {compatibility.element_harmony_score}%
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-2">Day Master Synergy</p>
                    <p className="text-3xl font-bold text-[#D6B25E]">
                      {compatibility.day_master_synergy}%
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-2">Stärke Gap</p>
                    <p className="text-3xl font-bold text-[#D6B25E]">
                      {compatibility.strength_gap}%
                    </p>
                  </div>
                </div>

                {/* Element Analysis */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Element Analyse</h3>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-gray-300">{compatibility.element_analysis}</p>
                  </div>
                </div>

                {/* Yearly Prediction */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Jahres-Prognose</h3>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-gray-300">{compatibility.year_forecast}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
