import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { useUser } from '../api/hooks/useUser';
import { useAuth } from '../api/hooks/useAuth';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { profile, birthData } = useUserStore();
  const { getUser, getBirthData } = useUser();
  const { logout } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        await getUser();
        await getBirthData();
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    loadData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05060A] to-[#0a0b12] p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">👤 Profil</h1>

        {/* User Info */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">Persönliche Informationen</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Name</p>
              <p className="text-xl font-semibold text-white">{user?.name || profile?.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">E-Mail</p>
              <p className="text-xl font-semibold text-white">{user?.email || profile?.email}</p>
            </div>
          </div>
        </div>

        {/* Birth Data */}
        {birthData && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-6">
            <h2 className="text-2xl font-bold text-white mb-6">🌙 Geburtsdaten</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Geburtsjahr</p>
                <p className="text-lg font-semibold text-white">{birthData.year}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Monat</p>
                <p className="text-lg font-semibold text-white">{birthData.month}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Tag</p>
                <p className="text-lg font-semibold text-white">{birthData.day}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Uhrzeit</p>
                <p className="text-lg font-semibold text-white">{birthData.hour}:{birthData.minute}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/couple')}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl border border-white/20 transition"
          >
            Beziehungsprofil bearbeiten
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold py-3 px-4 rounded-xl border border-red-500/30 transition"
          >
            Abmelden
          </button>
        </div>
      </div>
    </div>
  );
};
