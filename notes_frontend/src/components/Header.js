import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

// PUBLIC_INTERFACE
export default function Header({ theme, onToggleTheme }) {
  /** Top navigation header with app title, nav links, theme toggle, and auth actions. */
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-left">
        <Link to="/" className="brand">
          <span className="brand-accent">✦</span> Notes
        </Link>
        {user && (
          <nav className="nav">
            <NavLink to="/notes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>My Notes</NavLink>
          </nav>
        )}
      </div>

      <div className="header-right">
        <button className="btn ghost" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        {user ? (
          <>
            <span className="user-email">{user.email}</span>
            <button className="btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <div className="auth-links">
            <NavLink to="/login" className="btn ghost">Login</NavLink>
            <NavLink to="/register" className="btn">Register</NavLink>
          </div>
        )}
      </div>
    </header>
  );
}
