import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../../services/api/auth';

const AuthContext = createContext(null);

// status: 'loading' (bootstrapping /auth/me) | 'authenticated' | 'anonymous'
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');

  // Session bootstrap. 401 simply means "not signed in".
  useEffect(() => {
    let cancelled = false;
    authApi
      .getCurrentUser()
      .then((data) => {
        if (cancelled) return;
        setUser(data.user);
        setStatus('authenticated');
      })
      .catch(() => {
        if (cancelled) return;
        setUser(null);
        setStatus('anonymous');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Resolves { user, sessionVerified }. The login response carries the user,
  // then /auth/me confirms the cookie session is usable for authenticated calls.
  const login = useCallback(async (credentials) => {
    const { user: loggedInUser } = await authApi.login(credentials);
    try {
      const { user: me } = await authApi.getCurrentUser();
      setUser(me);
      setStatus('authenticated');
      return { user: me, sessionVerified: true };
    } catch (error) {
      if (error.status === 401) {
        // Credentials were accepted but the session cookie was not honoured.
        setUser(null);
        setStatus('anonymous');
        return { user: loggedInUser, sessionVerified: false };
      }
      throw error;
    }
  }, []);

  const register = useCallback((payload) => authApi.register(payload), []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Clear local session state regardless of the server response.
    }
    setUser(null);
    setStatus('anonymous');
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated',
      isCustomer: user?.role === 'CUSTOMER',
      login,
      register,
      logout,
    }),
    [user, status, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
