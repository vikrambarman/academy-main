import { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  help?: string;
  required?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export function Input({
  label,
  error,
  help,
  required,
  iconLeft,
  iconRight,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className="ds-form-field">
      {label && (
        <label
          htmlFor={inputId}
          className={`ds-form-label ${required ? "ds-form-label--required" : ""}`}
        >
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {iconLeft && (
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--portal-text-muted)",
              display: "flex",
              pointerEvents: "none",
            }}
          >
            {iconLeft}
          </span>
        )}
        <input
          id={inputId}
          className={`ds-input ${error ? "ds-input--error" : ""} ${className}`}
          style={iconLeft ? { paddingLeft: 36 } : undefined}
          {...props}
        />
        {iconRight && (
          <span
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--portal-text-muted)",
              display: "flex",
            }}
          >
            {iconRight}
          </span>
        )}
      </div>
      {error && <span className="ds-form-error">{error}</span>}
      {help && !error && <span className="ds-form-help">{help}</span>}
    </div>
  );
}