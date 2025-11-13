import { KebabIcon } from '@components/icons/KebabIcon';
import { useTheme } from '@context/theme/useTheme';
import type { KebabButtonProps } from './types';

export function KebabButton({ state }: KebabButtonProps) {
  const { colors } = useTheme();
  return (
    <>
      <div
        className="h-fit w-fit p-[0.5625rem] outline -outline-offset-1 rounded-xl"
        style={{
          backgroundColor: state === 'hover' ? colors.bg.tertiary : '',
          outlineColor: colors.border.default,
        }}
      >
        <KebabIcon></KebabIcon>
      </div>
    </>
  );
}
