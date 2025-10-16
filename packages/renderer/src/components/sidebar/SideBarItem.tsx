import { useTheme } from '@context/theme/useTheme';
interface SideBarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function SideBarItem({
  icon,
  children,
  className = '',
  ...props
}: SideBarItemProps) {
  const { colors } = useTheme();
  return (
    <>
      <div
        className={`flex gap-2 w-72 h-12 font-normal rounded-2xl px-4 py-3 ${className}`}
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
