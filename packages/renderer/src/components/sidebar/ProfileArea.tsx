import { DiamondIcon } from '@components/icons/DiamondIcon';
import ProfileHashIcon from '@components/icons/ProfileHashIcon';
import { SidebarLeftCollapseIcon } from '@components/icons/SidebarLeftCollapseIcon';
import clsx from 'clsx';

interface ProfileAreaProps {
  isCollapsed: boolean;
  setCollapsed: () => void;
}

export function ProfileArea({ isCollapsed, setCollapsed }: ProfileAreaProps) {
  return (
    <div
      className={clsx(
        'flex w-full h-fit items-center justify-between',
        isCollapsed ? 'px-1 py-1.5' : 'pl-3',
      )}
    >
      <div
        className={clsx(
          'flex gap-2 items-center justify-center hover:bg-tertiary rounded-xl',
          !isCollapsed && 'pl-2',
        )}
      >
        <ProfileHashIcon size={40}></ProfileHashIcon>
        {!isCollapsed && (
          <div className="flex px-3 py-1 gap-6 items-center justify-center">
            <div className="flex flex-col justify-center items-start">
              <h1 className="text-lg leading-7 font-semibold text-primary-content whitespace-nowrap">
                Harry's Shop
              </h1>
              <p className="text-xs leading-4 text-tertiary-content">
                harry@potter.com
              </p>
            </div>
            <DiamondIcon className="stroke-tertiary-content shrink-0"></DiamondIcon>
          </div>
        )}
      </div>
      {!isCollapsed && (
        <SidebarLeftCollapseIcon
          className={clsx('cursor-pointer stroke-tertiary-content')}
          onClick={setCollapsed}
        />
      )}
    </div>
  );
}
