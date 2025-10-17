import { useTheme } from '@context/theme/useTheme';
import React from 'react';

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
      buttonSize = 'px-3 py-[0.375rem]';
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
      className={`inline-flex border gap-2 rounded-xl box-border w-fit ${buttonSize} ${className}`}
      style={{
        color: colors.fg.primary,
        backgroundColor: colors.bg.tertiary,
        borderColor: colors.border.default,
      }}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
