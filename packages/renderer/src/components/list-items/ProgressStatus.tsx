import { DotIcon } from '@components/icons/DotIcon';
import { useTheme } from '@context/theme/useTheme';
import type { ProgressStatusProps } from './types';

export function ProgressStatus({ type }: ProgressStatusProps) {
  const { colors } = useTheme();
  return (
    <>
      <div
        className="flex items-center w-fit h-fit text-sm leading-5 gap-1.5 px-3 py-[0.4375rem] -outline-offset-1 outline rounded-xl"
        style={{
          outlineColor: colors.border.default,
          color: colors.fg.primary,
        }}
      >
        {type === 'progress' ? (
          <DotIcon type="green"></DotIcon>
        ) : (
          <DotIcon type="gray"></DotIcon>
        )}
        {type === 'progress' ? 'Progress' : 'Waiting'}
      </div>
    </>
  );
}
