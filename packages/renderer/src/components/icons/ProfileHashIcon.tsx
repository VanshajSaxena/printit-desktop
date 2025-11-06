import { useEffect, useState } from 'react';
import type { IconProps } from './types.ts';
import { useTheme } from '@context/theme/useTheme';
import { isWebSocketConnected } from '@app/preload';

function ProfileHash({ size, ...props }: IconProps) {
  const { colors } = useTheme();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let isMounted = false;

    const checkWebSocket = async () => {
      try {
        const result = await isWebSocketConnected();
        if (!isMounted) setConnected(result);
      } catch (error) {
        if (!isMounted) setConnected(false);
        console.error(error);
      }
    };

    checkWebSocket().catch((error: unknown) => {
      console.log(error);
    });

    return () => {
      isMounted = true;
    };
  }, []);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width={size} height={size} rx={8} fill={colors.bg.tertiary} />

      {connected && (
        <circle cx="35" cy="35" r="4" fill={colors.fg.status.success} />
      )}

      <path
        d="M18.31 10l-4.543 20m12.854-20l-4.505 20M10 24.056h18.718m-17.087-8.635H30"
        stroke={colors.fg.primary}
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default ProfileHash;
