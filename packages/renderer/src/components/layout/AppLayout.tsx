import { MainContent } from './MainContent';
import { SideBar } from './SideBar';
import { useState } from 'react';

export type ViewType = 'dashboard' | 'history' | 'settings' | 'help';

export function AppLayout() {
  const [selectedView, setSelectedView] = useState<ViewType>('dashboard');
  return (
    <div
      className={
        'flex gap-4 h-screen w-screen overflow-hidden pt-4 pl-4 bg-secondary select-none'
      }
    >
      <SideBar
        selectedView={selectedView}
        onViewChange={setSelectedView}
      ></SideBar>
      <MainContent activeView={selectedView}></MainContent>
    </div>
  );
}
