import { ReactNode } from "react";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral" | "accent";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  dot?: boolean;
  icon?: ReactNode;
  className?: string;
}

export function Badge({
  variant = "neutral",
  children,
  dot = false,
  icon,
  className = "",
}: BadgeProps) {
  const classes = ["ds-badge", `ds-badge--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      {dot && <span className="ds-badge__dot" />}
      {icon}
      {children}
    </span>
  );
}