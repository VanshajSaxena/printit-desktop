import { useTheme } from '@context/theme/useTheme';
import { DiamondIcon } from '@components/icons/DiamondIcon';
import ProfileHashIcon from '@components/icons/ProfileHashIcon';

export function ProfileArea() {
  const { colors } = useTheme();
  return (
    <>
      <div className="flex w-full px-6 h-fit items-center justify-between">
        <div className="flex gap-4 items-center">
          <ProfileHashIcon size={40}></ProfileHashIcon>
          <div className="flex flex-col justify-center">
            <h1
              className="text-lg leading-7 font-semibold"
              style={{ color: colors.fg.primary }}
            >
              Harry's Shop
            </h1>
            <p
              className="text-xs leading-4"
              style={{ color: colors.fg.tertiary }}
            >
              harry@potter.com
            </p>
          </div>
        </div>
        <DiamondIcon></DiamondIcon>
      </div>
    </>
  );
}
