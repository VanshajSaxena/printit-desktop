import { useTheme } from '@context/theme/useTheme';
import type { ButtonProps } from './types';

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
      buttonSize = 'px-3 py-[0.4375rem] text-sm leading-5';
      break;
    case 'lg':
      buttonSize = 'px-3 py-2 text-base leading-6';
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
      className={`inline-flex items-center h-fit w-fit -outline-offset-1 outline-1 gap-2 rounded-xl ${buttonSize} ${className}`}
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
