import { HistoryIcon } from '@components/icons/HistoryIcon';
import { HomeIcon } from '@components/icons/HomeIcon';
import { SettingsIcon } from '@components/icons/SettingsIcon.tsx';
import { SupportHeadphoneIcon } from '@components/icons/SupportHeadphoneIcon.tsx';
import { ProfileArea } from '@components/sidebar/ProfileArea';
import { SideBarItem } from '@components/sidebar/SideBarItem';
import type { ViewType } from './AppLayout';

export function SideBar({
  activeView,
  onViewChange,
}: {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}) {
  return (
    <aside className="w-72 flex-shrink-0">
      <div className="flex flex-col h-full">
        <ProfileArea></ProfileArea>
        <div className="flex flex-col flex-1 mt-12 gap-2">
          <SideBarItem
            icon={<HomeIcon size={24}></HomeIcon>}
            isActive={activeView === 'dashboard'}
            onClick={() => {
              onViewChange('dashboard');
            }}
          >
            Dashboard
          </SideBarItem>
          <SideBarItem
            icon={<HistoryIcon size={24}></HistoryIcon>}
            isActive={activeView === 'history'}
            onClick={() => {
              onViewChange('history');
            }}
          >
            History
          </SideBarItem>
          <div className="flex flex-col mt-auto mb-8 gap-2">
            <SideBarItem
              icon={<SettingsIcon size={24}></SettingsIcon>}
              isActive={activeView === 'settings'}
              onClick={() => {
                onViewChange('settings');
              }}
            >
              Settings
            </SideBarItem>
            <SideBarItem
              icon={<SupportHeadphoneIcon size={24}></SupportHeadphoneIcon>}
              isActive={activeView === 'help'}
              onClick={() => {
                onViewChange('help');
              }}
            >
              Help Center
            </SideBarItem>
          </div>
        </div>
      </div>
    </aside>
  );
}
