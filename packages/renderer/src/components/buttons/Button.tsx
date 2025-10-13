import React from 'react';
import { useTheme } from '../../context/theme/useTheme.ts';

interface ButtonProps {
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function Button({ icon, children, ...props }: ButtonProps) {
  const { colors } = useTheme();

  return (
    <button
      type="button"
      className="inline-flex rounded-lg"
      style={{ backgroundColor: colors.bg.tertiary }}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
