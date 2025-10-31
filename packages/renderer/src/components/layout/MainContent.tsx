import { useTheme } from '@context/theme/useTheme';
import { Dashboard } from '@pages/Dashboard';
import type { ViewType } from './AppLayout';

export function MainContent({ activeView }: { activeView: ViewType }) {
  const { colors } = useTheme();
  return (
    <main
      className="flex flex-col rounded-tl-3xl border-t border-l w-full h-full justify-start"
      style={{
        backgroundColor: colors.bg.primary,
        borderColor: colors.border.default,
      }}
    >
      {activeView === 'dashboard' && <Dashboard></Dashboard>}
    </main>
  );
}
