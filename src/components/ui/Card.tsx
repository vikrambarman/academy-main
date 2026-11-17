import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  hoverable?: boolean;
  elevated?: boolean;
  className?: string;
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

interface CardBodyProps {
  children: ReactNode;
}

interface CardFooterProps {
  children: ReactNode;
}

export function Card({ children, hoverable, elevated, className = "" }: CardProps) {
  const classes = [
    "ds-card",
    hoverable && "ds-card--hoverable",
    elevated && "ds-card--elevated",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}

export function CardHeader({ title, subtitle, actions }: CardHeaderProps) {
  return (
    <div className="ds-card__header">
      <div>
        <h3 className="ds-card__title">{title}</h3>
        {subtitle && <p className="ds-card__subtitle">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function CardBody({ children }: CardBodyProps) {
  return <div className="ds-card__body">{children}</div>;
}

export function CardFooter({ children }: CardFooterProps) {
  return <div className="ds-card__footer">{children}</div>;
}