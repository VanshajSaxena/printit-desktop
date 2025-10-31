import { useTheme } from '@context/theme/useTheme';
import { MainContent } from './MainContent';
import { SideBar } from './SideBar';
import { useState } from 'react';

export type ViewType = 'dashboard' | 'history' | 'settings' | 'help';

export function AppLayout() {
  const { colors } = useTheme();
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  return (
    <>
      <div
        className={'flex gap-4 h-screen pt-4 pl-4'}
        style={{ backgroundColor: colors.bg.secondary }}
      >
        <SideBar activeView={activeView} onViewChange={setActiveView}></SideBar>
        <MainContent activeView={activeView}></MainContent> {/* Home View */}
      </div>
    </>
  );
}

export default AppLayout;
