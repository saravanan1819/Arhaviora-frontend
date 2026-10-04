import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/Input/Input';
import { useAuth } from '../../features/auth/AuthContext';
import { E164 } from '../../services/api/addresses';
import { toApiError } from '../../services/api/errors';
import './Auth.css';

// Mirrors the backend password rule so the user gets feedback before submitting.
const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const validate = (form) => {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = 'First name is required';
  if (!form.lastName.trim()) errors.lastName = 'Last name is required';
  if (!form.email.trim()) errors.email = 'Email is required';
  if (form.phone.trim() && !E164.test(form.phone.trim())) {
    errors.phone = 'Use international format, e.g. +917598238098';
  }
  if (!STRONG_PASSWORD.test(form.password)) {
    errors.password =
      'At least 8 characters with an uppercase letter, a lowercase letter, a number and a special character';
  }
  return errors;
};

export const Register = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      await register({
        email: form.email.trim(),
        password: form.password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim() || undefined,
      });
      setDone(true);
    } catch (err) {
      const apiError = toApiError(err);
      setFieldErrors(apiError.fieldErrors);
      if (!apiError.errors) setFormError(apiError.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Account created</h1>
          <div className="auth-alert is-success" role="status">
            Your account is ready. You can sign in now.
          </div>
          <Link to="/login" className="auth-submit" style={{ display: 'grid', placeItems: 'center' }}>
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Join the Arhaviora family.</p>

        {formError && <div className="auth-alert" role="alert">{formError}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-row">
            <Input label="First name" autoComplete="given-name" value={form.firstName} onChange={update('firstName')} error={fieldErrors.firstName} />
            <Input label="Last name" autoComplete="family-name" value={form.lastName} onChange={update('lastName')} error={fieldErrors.lastName} />
          </div>
          <Input label="Email" type="email" autoComplete="email" value={form.email} onChange={update('email')} error={fieldErrors.email} />
          <Input label="Phone (optional)" type="tel" autoComplete="tel" placeholder="+917598238098" value={form.phone} onChange={update('phone')} error={fieldErrors.phone} />
          <Input label="Password" type="password" autoComplete="new-password" value={form.password} onChange={update('password')} error={fieldErrors.password} />
          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
