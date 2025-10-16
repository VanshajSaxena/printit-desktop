import { useTheme } from '@context/theme/useTheme';
import { Dashboard } from '@pages/Dashboard';

export function MainContent() {
  const { colors } = useTheme();
  return (
    <main
      className="flex flex-1 rounded-tl-3xl border-t border-l overflow-y-auto ml-4"
      style={{
        backgroundColor: colors.bg.primary,
        borderColor: colors.border.default,
      }}
    >
      <Dashboard></Dashboard>
    </main>
  );
}
