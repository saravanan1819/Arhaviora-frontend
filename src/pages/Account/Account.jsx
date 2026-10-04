import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusPanel } from '../../components/StatusPanel/StatusPanel';
import { AddressManager } from '../../components/AddressManager/AddressManager';
import { useAuth } from '../../features/auth/AuthContext';

export const Account = () => {
  const { status, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (status === 'loading') {
    return <div className="status-page"><StatusPanel>Loading…</StatusPanel></div>;
  }
  if (status !== 'authenticated') {
    return (
      <div className="status-page">
        <StatusPanel
          title="Sign in to your account"
          actions={[
            { label: 'Sign in', to: '/login', state: { from: '/account' } },
            { label: 'Create an account', to: '/register', outline: true },
          ]}
        >
          Sign in to view your account details.
        </StatusPanel>
      </div>
    );
  }

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
  return (
    <div className="status-page">
      <StatusPanel
        title={name || 'Your account'}
        actions={[
          { label: 'Wishlist', to: '/wishlist', outline: true },
          { label: 'Sign out', onClick: handleLogout },
        ]}
      >
        {user?.email}
      </StatusPanel>
      <div className="status-panel" style={{ paddingTop: 0 }}>
        <h2 className="status-panel-title">Saved addresses</h2>
        <AddressManager />
      </div>
    </div>
  );
};

export default Account;
