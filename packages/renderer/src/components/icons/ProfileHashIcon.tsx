import type { IconProps } from './types.ts';
import { useTheme } from '@context/theme/useTheme';

function ProfileHash({ size, ...props }: IconProps) {
  const { colors } = useTheme();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 43 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width={42.1411} height={42.1411} rx={8} fill={colors.bg.tertiary} />
      <path
        d="M19.31 11l-4.543 20m12.854-20l-4.505 20M11 25.056h18.718m-17.087-8.635H31"
        stroke={colors.fg.primary}
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default ProfileHash;
