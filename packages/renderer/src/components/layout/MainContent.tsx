import { useTheme } from '../../context/theme/useTheme';

export function MainContent() {
  const { colors } = useTheme();
  return (
    <main
      className="flex-1 rounded-tl-2xl overflow-y-auto p-8 ml-4"
      style={{ backgroundColor: colors.bg.primary }}
    >
      <h2
        className="text-2xl font-semibold mb-6"
        style={{ color: colors.fg.primary }}
      >
        Dashboard
      </h2>
    </main>
  );
}
