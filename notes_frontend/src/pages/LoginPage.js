import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Sign-in form for returning users. */
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/notes';

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (error) {
      setErr(error?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="page-title">Notes</h1>
      <div className="card auth-card">
        <h2>Sign In</h2>
        <form onSubmit={onSubmit} className="auth-form">
          <label className="label">
            Email
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="label">
            Password
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {err && <div className="alert error">{err}</div>}
          <button className="btn primary full" type="submit" disabled={busy}>{busy ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <div className="auth-alt">
          New here? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
