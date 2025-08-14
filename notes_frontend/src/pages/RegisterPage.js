import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function RegisterPage() {
  /** Registration form for new users. */
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      await register(email.trim(), password);
      navigate('/notes', { replace: true });
    } catch (error) {
      setErr(error?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="page-title">Notes</h1>
      <div className="card auth-card">
        <h2>Create Account</h2>
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
          <button className="btn primary full" type="submit" disabled={busy}>{busy ? 'Creating...' : 'Register'}</button>
        </form>
        <div className="auth-alt">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
