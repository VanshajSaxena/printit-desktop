import type { ButtonProps } from './types';

export function Button({
  size,
  icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  let buttonSize = '';
  switch (size) {
    case 'md':
      buttonSize = 'px-3 py-[0.4375rem] text-sm leading-5';
      break;
    case 'lg':
      buttonSize = 'px-3 py-2 text-base leading-6';
      break;
    default:
      break;
  }

  return (
    <button
      type="button"
      className={`inline-flex items-center h-fit w-fit gap-2 rounded-xl ${buttonSize} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
