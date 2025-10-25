import { useTheme } from '@context/theme/useTheme';

interface SideBarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  isActive?: boolean;
}

export function SideBarItem({
  icon,
  children,
  className = '',
  isActive = false,
  ...props
}: SideBarItemProps) {
  const { colors } = useTheme();

  const activeStyle = isActive
    ? { backgroundColor: colors.bg.tertiary, color: colors.fg.primary }
    : { backgroundColor: colors.bg.secondary, color: colors.fg.secondary };

  return (
    <>
      <div
        className={`flex gap-2 w-72 h-12 font-normal rounded-2xl px-4 py-3 ${className}`}
        style={activeStyle}
        {...props}
      >
        {icon}
        {children}
      </div>
    </>
  );
}
