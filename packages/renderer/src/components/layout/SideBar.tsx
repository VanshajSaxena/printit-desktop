import { HistoryIcon } from '@components/icons/HistoryIcon';
import { HomeIcon } from '@components/icons/HomeIcon';
import { SettingsIcon } from '@components/icons/SettingsIcon.tsx';
import { SidebarRightCollapseIcon } from '@components/icons/SidebarRightCollapseIcon';
import { SupportHeadphoneIcon } from '@components/icons/SupportHeadphoneIcon.tsx';
import { ProfileArea } from '@components/sidebar/ProfileArea';
import {
  SideBarItem,
  type SideBarItemProps,
} from '@components/sidebar/SideBarItem';
import clsx from 'clsx';
import { useState } from 'react';
import type { ViewType } from './AppLayout';

export function SideBar({
  selectedView,
  onViewChange,
}: {
  selectedView: ViewType;
  onViewChange: (view: ViewType) => void;
}) {
  const [isCollapsed, setCollapsed] = useState(false);
  const sidebarItems: SideBarItemProps[] = [
    {
      type: 'dashboard',
      label: 'Dashboard',
      icon: <HomeIcon className="shrink-0" />,
    },
    {
      type: 'history',
      label: 'History',
      icon: <HistoryIcon className="shrink-0" />,
    },
    {
      type: 'settings',
      label: 'Settings',
      icon: <SettingsIcon className="shrink-0" />,
    },
    {
      type: 'help',
      label: 'Help Center',
      icon: <SupportHeadphoneIcon className="shrink-0" />,
    },
  ];
  return (
    <aside
      className={clsx(
        'flex flex-col h-full shrink-0 py-4 animate transition-all duration-300 justify-between items-center',
        isCollapsed ? 'w-12' : 'w-72',
      )}
    >
      <div
        className={clsx(
          'flex flex-col justify-between items-center w-full',
          isCollapsed ? 'gap-6' : 'gap-18',
        )}
      >
        <ProfileArea
          isCollapsed={isCollapsed}
          setCollapsed={() => {
            setCollapsed(true);
          }}
        />
        {isCollapsed && (
          <SidebarRightCollapseIcon
            className="stroke-tertiary-content cursor-pointer"
            onClick={() => {
              setCollapsed(false);
            }}
          />
        )}
        <div className="flex flex-col gap-2 w-full h-fit">
          {sidebarItems.slice(0, 2).map((item) => (
            <SideBarItem
              key={item.type}
              isSelected={selectedView === item.type}
              isCollapsed={isCollapsed}
              onClick={() => {
                onViewChange(item.type);
              }}
              {...item}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full h-fit">
        {sidebarItems.slice(2).map((item) => (
          <SideBarItem
            key={item.type}
            isSelected={selectedView === item.type}
            isCollapsed={isCollapsed}
            onClick={() => {
              onViewChange(item.type);
            }}
            {...item}
          />
        ))}
      </div>
    </aside>
  );
}
