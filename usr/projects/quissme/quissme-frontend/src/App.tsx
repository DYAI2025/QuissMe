import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AuthProvider } from './components/common/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';

// Auth Pages
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { BirthDataPage } from './pages/Auth/BirthDataPage';

// Main Pages
import { HomePage } from './pages/HomePage';
import { QuizPage } from './pages/QuizPage';
import { CoupleProfilePage } from './pages/CoupleProfilePage';
import { ChallengesPage } from './pages/ChallengesPage';
import { PatternsPage } from './pages/PatternsPage';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/birth-data" element={<BirthDataPage />} />

            {/* Protected Routes with Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/home" element={<HomePage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/couple" element={<CoupleProfilePage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/patterns" element={<PatternsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Redirect root to home or login */}
            <Route path="/" element={<Navigate to="/home" replace />} />

            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
