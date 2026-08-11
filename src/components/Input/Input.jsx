import React from 'react';
import './Input.css';

export const Input = ({
  label,
  error,
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  ...props
}) => {
  return (
    <div className={`input-field-group ${className}`}>
      {label && <label className="input-field-label">{label}</label>}
      <div className={`input-field-wrapper ${error ? 'has-error' : ''}`}>
        {Icon && <Icon size={18} className="input-icon-slot" />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="input-native-control"
          {...props}
        />
      </div>
      {error && <span className="input-field-error">{error}</span>}
    </div>
  );
};
