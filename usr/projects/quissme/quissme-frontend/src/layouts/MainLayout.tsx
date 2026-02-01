import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const navItems = [
    { path: '/home', label: '🏠', title: 'Home' },
    { path: '/quiz', label: '🎯', title: 'Quiz' },
    { path: '/couple', label: '💞', title: 'Couple' },
    { path: '/challenges', label: '⚡', title: 'Challenges' },
    { path: '/patterns', label: '📊', title: 'Patterns' },
    { path: '/profile', label: '👤', title: 'Profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05060A] to-[#0a0b12]">
      {/* Main Content */}
      <main className="pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      {user && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/5 backdrop-blur-md border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex justify-around items-center">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
                    isActive(item.path)
                      ? 'bg-[#D6B25E]/20 text-[#D6B25E]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title={item.title}
                >
                  <span className="text-2xl">{item.label}</span>
                  <span className="text-xs hidden sm:inline">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};
