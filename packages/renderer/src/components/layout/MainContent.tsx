import { useTheme } from '../../context/theme/useTheme';

export function MainContent() {
  const { theme } = useTheme();
  return (
    <main
      className="flex-1 rounded-tl-2xl overflow-y-auto p-8 ml-4"
      style={{ backgroundColor: theme.colors.bg.primary }}
    >
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
    </main>
  );
}
