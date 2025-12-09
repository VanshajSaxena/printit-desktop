import { DotIcon } from '@components/icons/DotIcon';
import type { ProgressStatusProps } from './types';

export function ProgressStatus({ type }: ProgressStatusProps) {
  return (
    <>
      <div className="flex items-center w-fit h-fit text-sm leading-5 gap-1.5 px-3 py-1.75 -outline-offset-1 outline outline-border-default text-primary-content rounded-xl">
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
