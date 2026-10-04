import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input/Input';
import { useAuth } from '../../features/auth/AuthContext';
import { toApiError } from '../../services/api/errors';
import './Auth.css';

export const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [sessionWarning, setSessionWarning] = useState(false);

  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSessionWarning(false);
    setSubmitting(true);
    try {
      const { sessionVerified } = await login({ email: form.email.trim(), password: form.password });
      if (sessionVerified) {
        navigate(redirectTo, { replace: true });
      } else {
        setSessionWarning(true);
      }
    } catch (err) {
      setError(toApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const fields = error?.fieldErrors || {};

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your Arhaviora account.</p>

        {error && !error.errors && <div className="auth-alert" role="alert">{error.message}</div>}
        {sessionWarning && (
          <div className="auth-alert is-warning" role="alert">
            We couldn't start your session right now, so you are not signed in. Please try again later.
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update('email')}
            error={fields.email}
            required
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={update('password')}
            error={fields.password}
            required
          />
          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
