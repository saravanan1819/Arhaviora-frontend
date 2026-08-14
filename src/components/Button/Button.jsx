import React from 'react';
import { ArrowUpRightIcon } from '../Icons/Icons';
import './Button.css';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',        
  icon = true,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-pill-component btn-${variant} btn-${size} ${className}`}
      {...props}
    >
      <span className="btn-label">{children}</span>
      {icon && <ArrowUpRightIcon size={size === 'sm' ? 16 : 20} className="btn-icon" />}
    </button>
  );
};
