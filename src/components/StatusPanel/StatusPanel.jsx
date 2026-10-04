import React from 'react';
import { Link } from 'react-router-dom';
import './StatusPanel.css';

// actions: [{ label, to?, state?, onClick?, outline? }]. Use role="alert" for errors.
export const StatusPanel = ({ title, children, actions = [], role = 'status' }) => (
  <div className="status-panel" role={role}>
    {title && <h1 className="status-panel-title">{title}</h1>}
    {children && <p className="status-panel-text">{children}</p>}
    {actions.length > 0 && (
      <div className="status-panel-actions">
        {actions.map((a) => {
          const cls = `status-panel-cta${a.outline ? ' is-outline' : ''}`;
          return a.to ? (
            <Link key={a.label} to={a.to} state={a.state} className={cls}>{a.label}</Link>
          ) : (
            <button key={a.label} type="button" onClick={a.onClick} className={cls}>{a.label}</button>
          );
        })}
      </div>
    )}
  </div>
);

export default StatusPanel;
