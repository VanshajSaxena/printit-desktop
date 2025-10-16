import { HistoryIcon } from '@components/icons/HistoryIcon';
import { HomeIcon } from '@components/icons/HomeIcon';
import { SettingsIcon } from '@components/icons/SettingsIcon.tsx';
import { SupportHeadphoneIcon } from '@components/icons/SupportHeadphoneIcon.tsx';
import { ProfileArea } from '@components/sidebar/ProfileArea';
import { SideBarItem } from '@components/sidebar/SideBarItem';

export function SideBar() {
  return (
    <aside className="w-72 flex-shrink-0">
      <div className="flex flex-col h-full">
        <ProfileArea></ProfileArea>
        <div className="flex flex-col flex-1 mt-12 gap-2">
          <SideBarItem
            icon={<HomeIcon size={24}></HomeIcon>}
            children="Dashboard"
          ></SideBarItem>
          <SideBarItem
            icon={<HistoryIcon size={24}></HistoryIcon>}
            children="History"
          ></SideBarItem>
          <div className="flex flex-col mt-auto mb-8 gap-2">
            <SideBarItem
              icon={<SettingsIcon size={24}></SettingsIcon>}
              children="Settings"
            ></SideBarItem>
            <SideBarItem
              icon={<SupportHeadphoneIcon size={24}></SupportHeadphoneIcon>}
              children="Help Center"
            ></SideBarItem>
          </div>
        </div>
      </div>
    </aside>
  );
}
