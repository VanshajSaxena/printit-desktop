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
  varient,
  backgroundColor = '',
  className = '',
  ...props
}: ButtonProps) {
  let buttonSize = '';
  switch (size) {
    case 'md':
      buttonSize = 'px-3 py-[0.4375rem] text-sm';
      break;
    case 'lg':
      buttonSize = 'px-3 py-2 text-base';
      break;
    default:
      break;
  }

  switch (varient) {
    case 'default':
      backgroundColor = 'bg-tertiary';
      break;
    case 'ghost':
      backgroundColor = 'bg-primary';
      break;
    default:
      break;
  }

  return (
    <button
      type="button"
      className={`inline-flex bg-primary items-center h-fit w-fit -outline-offset-1 outline-1 gap-2 rounded-xl text-primary-content outline-primary ${backgroundColor} ${buttonSize} ${className}`}
      // outlineColor: colors.border.default, FIX: outline
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
