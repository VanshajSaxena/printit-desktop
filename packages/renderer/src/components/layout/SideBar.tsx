import { ProfileArea } from '../sidebar/ProfileArea';

export function SideBar() {
  return (
    <aside className="w-72 flex-shrink-0">
      <div className="flex flex-col h-full">
        <ProfileArea></ProfileArea>
      </div>
    </aside>
  );
}
