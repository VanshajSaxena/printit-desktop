import React from 'react';
import { useTheme } from '../../context/theme/useTheme.ts';

type ButtonSizes = 'md' | 'lg';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  size?: ButtonSizes;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function Button({
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const { colors } = useTheme();
  let buttonSize = '';
  switch (size) {
    case 'md':
      buttonSize = 'px-3 py-[6px]';
      break;
    case 'lg':
      buttonSize = 'px-3 py-2';
      break;
    default:
      break;
  }

  return (
    <button
      type="button"
      className={`inline-flex rounded-xl ${buttonSize} ${className}`}
      style={{ backgroundColor: colors.bg.tertiary }}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
