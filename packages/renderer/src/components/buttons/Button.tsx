import React from 'react';
import { useTheme } from '../../context/theme/useTheme.ts';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'status';
type ButtonSize = 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  statusColor?: string;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();

  const sizeClasses = {
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const dynamicStyle: React.CSSProperties = {
    ...style,
  };

  switch (variant) {
    case 'primary':
      dynamicStyle.backgroundColor = 'transparent';
      dynamicStyle.color = theme.colors.fg.primary;
      break;
    case 'secondary':
      dynamicStyle.borderColor = theme.colors.bg.tertiary;
      dynamicStyle.color = theme.colors.fg.primary;
      break;
  }

  return (
    <button
      type="button"
      className={`inline-flex border items-center gap-1.5 rounded-lg font-normal transition-all  duration-200 ${sizeClasses[size]} ${className}`}
      style={dynamicStyle}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
