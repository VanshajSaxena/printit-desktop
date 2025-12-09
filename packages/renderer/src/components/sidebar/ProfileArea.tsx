import { DiamondIcon } from "@components/icons/DiamondIcon";
import ProfileHashIcon from "@components/icons/ProfileHashIcon";
import { SidebarLeftCollapseIcon } from "@components/icons/SidebarLeftCollapseIcon";
import clsx from "clsx";

interface ProfileAreaProps {
  isCollapsed: boolean;
  setCollapsed: () => void;
}

export function ProfileArea({ isCollapsed, setCollapsed }: ProfileAreaProps) {
  return (
    <div
      className={clsx(
        "flex h-fit w-full items-center justify-between",
        isCollapsed ? "px-1 py-1.5" : "pl-3",
      )}
    >
      <div
        className={clsx(
          "flex items-center justify-center gap-2 rounded-xl hover:bg-tertiary",
          !isCollapsed && "pl-2",
        )}
      >
        <ProfileHashIcon size={40}></ProfileHashIcon>
        {!isCollapsed && (
          <div className="flex items-center justify-center gap-6 px-3 py-1">
            <div className="flex flex-col items-start justify-center">
              <h1 className="text-lg leading-7 font-semibold whitespace-nowrap text-primary-content">
                Harry's Shop
              </h1>
              <p className="text-xs leading-4 text-tertiary-content">
                harry@potter.com
              </p>
            </div>
            <DiamondIcon className="shrink-0 stroke-tertiary-content"></DiamondIcon>
          </div>
        )}
      </div>
      {!isCollapsed && (
        <SidebarLeftCollapseIcon
          className={clsx("cursor-pointer stroke-tertiary-content")}
          onClick={setCollapsed}
        />
      )}
    </div>
  );
}
