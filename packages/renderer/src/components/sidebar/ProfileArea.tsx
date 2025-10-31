import { useTheme } from '@context/theme/useTheme';
import { DiamondIcon } from '@components/icons/DiamondIcon';
import ProfileHashIcon from '@components/icons/ProfileHashIcon';

export function ProfileArea() {
  const { colors } = useTheme();
  return (
    <>
      <div className="flex w-full pl-6 pr-6 h-fit items-center ">
        <div className="flex gap-4 items-center">
          <ProfileHashIcon size={40}></ProfileHashIcon>
          <div className="flex flex-col justify-start">
            <h1
              className="text-lg font-bold"
              style={{ color: colors.fg.primary }}
            >
              Harry's Shop
            </h1>
            <h4 className="text-xs" style={{ color: colors.fg.tertiary }}>
              harry@potter.com
            </h4>
          </div>
        </div>
        <DiamondIcon className="ml-auto"></DiamondIcon>
      </div>
    </>
  );
}
