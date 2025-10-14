import { HistoryIcon } from '../icons/HistoryIcon.tsx';
import { HomeIcon } from '../icons/HomeIcon';
import { ProfileArea } from '../sidebar/ProfileArea';
import { SideBarItem } from '../sidebar/SideBarItem';

export function SideBar() {
  return (
    <aside className="w-72 flex-shrink-0">
      <div className="flex flex-col h-full">
        <ProfileArea></ProfileArea>
        <div className="flex flex-col mt-12 gap-2">
          <SideBarItem
            icon={<HomeIcon size={24}></HomeIcon>}
            children="Dashboard"
          ></SideBarItem>
          <SideBarItem
            icon={<HistoryIcon size={24}></HistoryIcon>}
            children="History"
          ></SideBarItem>
        </div>
      </div>
    </aside>
  );
}
