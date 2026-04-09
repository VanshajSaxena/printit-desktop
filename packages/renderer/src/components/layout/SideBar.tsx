import { GearIcon } from "@components/icons/GearIcon";
import { HomeIcon } from "@components/icons/HomeIcon";
import { SidebarRightCollapseIcon } from "@components/icons/SidebarRightCollapseIcon";
import { SupportHeadphoneIcon } from "@components/icons/SupportHeadphoneIcon.tsx";
import { ProfileArea } from "@components/sidebar/ProfileArea";
import {
  SideBarItem,
  type SideBarItemProps,
} from "@components/sidebar/SideBarItem";
import clsx from "clsx";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import type { ViewType } from "./AppLayout";

export function SideBar({
  selectedView,
  onViewChange,
}: {
  selectedView: ViewType;
  onViewChange: (view: ViewType) => void;
}) {
  const [isCollapsed, setCollapsed] = useState(false);
  const sidebarItems: SideBarItemProps[] = [
    {
      type: "dashboard",
      label: "Dashboard",
      icon: <HomeIcon className="shrink-0" />,
    },
    {
      type: "analytics",
      label: "Analytics",
      icon: <TrendingUp className="shrink-0" />,
    },
    {
      type: "settings",
      label: "Settings",
      icon: <GearIcon className="shrink-0" />,
    },
    {
      type: "help",
      label: "Help Center",
      icon: <SupportHeadphoneIcon className="shrink-0" />,
    },
  ];

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1024px)");
    const update = () => {
      setCollapsed(media.matches);
    };
    update();
    media.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  return (
    <aside
      className={clsx(
        "animate flex h-full shrink-0 flex-col items-center justify-between py-4 transition-all duration-300",
        isCollapsed ? "w-12" : "w-72",
      )}
    >
      <div
        className={clsx(
          "flex w-full flex-col items-center justify-between",
          isCollapsed ? "gap-6" : "gap-18",
        )}
      >
        <ProfileArea
          isCollapsed={isCollapsed}
          setCollapsed={() => {
            setCollapsed(true);
          }}
        />
        {isCollapsed && (
          <SidebarRightCollapseIcon
            className="cursor-pointer stroke-tertiary-content hover:stroke-primary-content"
            onClick={() => {
              setCollapsed(false);
            }}
          />
        )}
        <div className="flex h-fit w-full flex-col gap-2">
          {sidebarItems.slice(0, 2).map((item) => (
            <SideBarItem
              key={item.type}
              isSelected={selectedView === item.type}
              isCollapsed={isCollapsed}
              onClick={() => {
                onViewChange(item.type);
              }}
              {...item}
            />
          ))}
        </div>
      </div>
      <div className="flex h-fit w-full flex-col gap-2">
        {sidebarItems.slice(2).map((item) => (
          <SideBarItem
            key={item.type}
            isSelected={selectedView === item.type}
            isCollapsed={isCollapsed}
            onClick={() => {
              onViewChange(item.type);
            }}
            {...item}
          />
        ))}
      </div>
    </aside>
  );
}
