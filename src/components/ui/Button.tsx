import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "success";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  iconOnly?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  iconOnly = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const classes = [
    "ds-btn",
    `ds-btn--${variant}`,
    `ds-btn--${size}`,
    fullWidth && "ds-btn--full",
    iconOnly && "ds-btn--icon",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === "xs" ? 10 : 14} className="animate-spin" />
      ) : (
        icon
      )}
      {!iconOnly && children}
      {iconRight && !loading && iconRight}
    </button>
  );
}