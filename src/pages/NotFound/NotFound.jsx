import React from 'react';
import { StatusPanel } from '../../components/StatusPanel/StatusPanel';

export const NotFound = () => (
  <div className="status-page">
    <StatusPanel
      title="This page isn't available"
      actions={[{ label: 'Back to Shop', to: '/shop' }, { label: 'Home', to: '/', outline: true }]}
    >
      The page you are looking for doesn&apos;t exist or isn&apos;t available yet.
    </StatusPanel>
  </div>
);

export default NotFound;
