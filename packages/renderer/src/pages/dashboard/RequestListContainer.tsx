import { useTheme } from '@context/theme/useTheme';
import type { ReactNode } from 'react';

export interface RequestListContainerProps {
  children: ReactNode;
}
export function RequestListContainer(props: RequestListContainerProps) {
  const { colors } = useTheme();
  const children = props.children;
  return (
    <>
      <div
        className="border w-full rounded-3xl min-w-4xl h-full min-h-96 max-h-1/2 2xl:max-h-2/3 overflow-y-auto [mask-image:linear-gradient(black,black)]"
        style={{ borderColor: colors.border.default }}
      >
        {children}
      </div>
    </>
  );
}
