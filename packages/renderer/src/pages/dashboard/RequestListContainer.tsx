import { useTheme } from '@context/theme/useTheme';

export function RequestListContainer() {
  const { colors } = useTheme();
  return (
    <>
      <div
        className="border w-full rounded-3xl min-w-4xl h-full min-h-96 max-h-1/2 2xl:max-h-2/3"
        style={{ borderColor: colors.border.default }}
      ></div>
    </>
  );
}
