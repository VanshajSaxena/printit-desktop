import { HistoryIcon } from '@components/icons/HistoryIcon';
import { HomeIcon } from '@components/icons/HomeIcon';
import { SettingsIcon } from '@components/icons/SettingsIcon.tsx';
import { SupportHeadphoneIcon } from '@components/icons/SupportHeadphoneIcon.tsx';
import { ProfileArea } from '@components/sidebar/ProfileArea';
import { SideBarItem } from '@components/sidebar/SideBarItem';
import type { ViewType } from './AppLayout';
import type { IconProps } from '@components/icons/types';

export function SideBar({
  activeView,
  onViewChange,
}: {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}) {
  const sidebarItems: {
    type: ViewType;
    label: string;
    icon: React.ComponentType<IconProps>;
  }[] = [
    { type: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { type: 'history', label: 'History', icon: HistoryIcon },
    {
      type: 'settings',
      label: 'Settings',
      icon: SettingsIcon,
    },
    {
      type: 'help',
      label: 'Help Center',
      icon: SupportHeadphoneIcon,
    },
  ];
  return (
    <aside className="flex flex-col h-full w-72 shrink-0 py-4">
      <ProfileArea></ProfileArea>
      <div className="flex flex-col flex-1 mt-16 gap-2">
        {sidebarItems.slice(0, 2).map((item) => (
          <SideBarItem
            key={item.type}
            IconComponent={item.icon}
            isActive={activeView === item.type}
            onClick={() => {
              onViewChange(item.type);
            }}
          >
            {item.label}
          </SideBarItem>
        ))}
        <div className="flex flex-col flex-1 gap-2 justify-end">
          {sidebarItems.slice(2).map((item) => (
            <SideBarItem
              key={item.type}
              IconComponent={item.icon}
              isActive={activeView === item.type}
              onClick={() => {
                onViewChange(item.type);
              }}
            >
              {item.label}
            </SideBarItem>
          ))}
        </div>
      </div>
    </aside>
  );
}
