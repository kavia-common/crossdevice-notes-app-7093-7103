import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import { AuthApi } from '../api/client';
import { Navigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to consume authentication context (user, login, logout, register). */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state and methods to children. */
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Initialize from cookie/localStorage; best-effort user restore
    const token = Cookies.get('auth_token');
    const savedEmail = localStorage.getItem('auth_user_email');
    if (token && savedEmail) {
      setUser({ email: savedEmail });
    }
    setInitializing(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await AuthApi.login(email, password);
    const u = data?.user || { email };
    setUser(u);
    localStorage.setItem('auth_user_email', u.email || email);
    return u;
  }, []);

  const register = useCallback(async (email, password) => {
    const data = await AuthApi.register(email, password);
    // Some backends log the user in immediately
    const u = data?.user || { email };
    setUser(u);
    localStorage.setItem('auth_user_email', u.email || email);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await AuthApi.logout();
    setUser(null);
    localStorage.removeItem('auth_user_email');
  }, []);

  const value = useMemo(() => ({ user, login, register, logout }), [user, login, register, logout]);

  if (initializing) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function ProtectedRoute({ children }) {
  /** Guard component to protect routes requiring authentication. */
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
