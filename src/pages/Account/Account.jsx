import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusPanel } from '../../components/StatusPanel/StatusPanel';
import { useAuth } from '../../features/auth/AuthContext';

export const Account = () => {
  const { status, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  let body;
  if (status === 'loading') {
    body = <StatusPanel>Loading…</StatusPanel>;
  } else if (status !== 'authenticated') {
    body = (
      <StatusPanel
        title="Sign in to your account"
        actions={[
          { label: 'Sign in', to: '/login', state: { from: '/account' } },
          { label: 'Create an account', to: '/register', outline: true },
        ]}
      >
        Sign in to view your account details.
      </StatusPanel>
    );
  } else {
    const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
    body = (
      <StatusPanel
        title={name || 'Your account'}
        actions={[
          { label: 'Wishlist', to: '/wishlist', outline: true },
          { label: 'Sign out', onClick: handleLogout },
        ]}
      >
        {user?.email}
      </StatusPanel>
    );
  }

  return <div className="status-page">{body}</div>;
};

export default Account;
