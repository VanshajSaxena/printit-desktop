import { useTheme } from '@context/theme/useTheme';
import { MainContent } from './MainContent';
import { SideBar } from './SideBar';

export function AppLayout() {
  const { colors } = useTheme();
  return (
    <>
      <div
        className={'flex h-screen pt-4 pl-4'}
        style={{ backgroundColor: colors.bg.secondary }}
      >
        <SideBar></SideBar>
        <MainContent></MainContent>
      </div>
    </>
  );
}

export default AppLayout;
