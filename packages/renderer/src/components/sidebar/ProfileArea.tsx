import { useTheme } from '../../context/theme/useTheme';
import DiamondIcon from '../icons/DiamondIcon';
import ProfileHashIcon from '../icons/ProfileHashIcon';

export function ProfileArea() {
  const { colors } = useTheme();
  return (
    <>
      <div className="flex mt-4 ml-4 mr-4 items-center">
        <ProfileHashIcon size={43}></ProfileHashIcon>
        <div className="flex flex-col ml-4">
          <h1
            className="text-xl font-bold"
            style={{ color: colors.fg.primary }}
          >
            Harry's Shop
          </h1>
          <h4 className="text-xs" style={{ color: colors.fg.tertiary }}>
            harry@potter.com
          </h4>
        </div>
        <DiamondIcon className="ml-auto"></DiamondIcon>
      </div>
    </>
  );
}
