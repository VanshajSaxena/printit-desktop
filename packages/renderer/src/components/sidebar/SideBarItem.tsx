import { useTheme } from '../../context/theme/useTheme';
interface SideBarItemProps {
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function SideBarItem({ icon, children, ...props }: SideBarItemProps) {
  const { colors } = useTheme();
  return (
    <>
      <div
        className="flex gap-2 w-72 h-12 rounded-2xl px-4 py-3"
        style={{
          backgroundColor: colors.bg.tertiary,
          color: colors.fg.primary,
        }}
        {...props}
      >
        {icon}
        {children}
      </div>
    </>
  );
}
