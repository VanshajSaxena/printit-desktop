import { MainContent } from './MainContent';
import { SideBar } from './SideBar';
import { useState } from 'react';

export type ViewType = 'dashboard' | 'history' | 'settings' | 'help';

export function AppLayout() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  return (
    <div
      className={
        'flex gap-4 h-screen w-screen overflow-hidden pt-4 pl-4 bg-secondary'
      }
    >
      <SideBar activeView={activeView} onViewChange={setActiveView}></SideBar>
      <MainContent activeView={activeView}></MainContent> {/* Home View */}
    </div>
  );
}

export default AppLayout;
