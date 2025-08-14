import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import { AuthProvider, ProtectedRoute, useAuth } from './auth/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotesPage from './pages/NotesPage';

// PUBLIC_INTERFACE
function AppShell() {
  /** Application shell containing header, routes, and theme management. */
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const location = useLocation();
  const showHeader = useMemo(() => true, [location.pathname]);

  return (
    <div className="app">
      {showHeader && <Header theme={theme} onToggleTheme={toggleTheme} />}
      <div className="app-body">
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <NotesPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function RootRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? '/notes' : '/login'} replace />;
}

// PUBLIC_INTERFACE
export default function App() {
  /** Root app component wrapping the shell with providers. */
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
