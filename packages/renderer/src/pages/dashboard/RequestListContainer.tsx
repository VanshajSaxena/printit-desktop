import { useTheme } from '@context/theme/useTheme';

export function RequestListContainer() {
  const { colors } = useTheme();
  return (
    <>
      <div
        className="border w-full h-96 rounded-3xl"
        style={{ borderColor: colors.border.default }}
      ></div>
    </>
  );
}
