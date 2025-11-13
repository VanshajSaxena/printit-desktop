import { DiamondIcon } from '@components/icons/DiamondIcon';
import ProfileHashIcon from '@components/icons/ProfileHashIcon';

export function ProfileArea() {
  return (
    <>
      <div className="flex w-full px-6 h-fit items-center justify-between">
        <div className="flex gap-4 items-center">
          <ProfileHashIcon size={40}></ProfileHashIcon>
          <div className="flex flex-col justify-center">
            <h1 className="text-lg leading-7 font-semibold text-primary-content">
              Harry's Shop
            </h1>
            <p className="text-xs leading-4 text-tertiary-content">
              harry@potter.com
            </p>
          </div>
        </div>
        <DiamondIcon></DiamondIcon>
      </div>
    </>
  );
}
