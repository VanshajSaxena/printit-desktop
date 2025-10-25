import { useTheme } from '@context/theme/useTheme';
import React from 'react';

type ButtonSizes = 'md' | 'lg';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  size?: ButtonSizes;
  varient: 'default' | 'ghost';
  icon?: React.ReactNode;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export function Button({
  size = 'md',
  icon,
  children,
  color,
  varient,
  backgroundColor,
  className = '',
  ...props
}: ButtonProps) {
  const { colors } = useTheme();

  let buttonSize = '';
  switch (size) {
    case 'md':
      buttonSize = 'px-3 py-[0.375rem]';
      break;
    case 'lg':
      buttonSize = 'px-3 py-2';
      break;
    default:
      break;
  }

  switch (varient) {
    case 'default':
      backgroundColor = colors.bg.tertiary;
      break;
    case 'ghost':
      backgroundColor = colors.bg.primary;
      break;
    default:
      break;
  }

  return (
    <button
      type="button"
      className={`inline-flex items-center -outline-offset-1 outline-1 gap-2 leading-none rounded-xl w-fit ${buttonSize} ${className}`}
      style={{
        color: color ?? colors.fg.primary,
        backgroundColor: backgroundColor,
        outlineColor: colors.border.default,
      }}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
