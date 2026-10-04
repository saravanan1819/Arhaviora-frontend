import React, { useId } from 'react';
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
  const autoId = useId();
  const id = props.id || autoId;
  const errorId = `${id}-error`;
  return (
    <div className={`input-field-group ${className}`}>
      {label && <label className="input-field-label" htmlFor={id}>{label}</label>}
      <div className={`input-field-wrapper ${error ? 'has-error' : ''}`}>
        {Icon && <Icon size={18} className="input-icon-slot" />}
        <input
          id={id}
          type={type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="input-native-control"
          {...props}
        />
      </div>
      {error && <span className="input-field-error" id={errorId} role="alert">{error}</span>}
    </div>
  );
};
