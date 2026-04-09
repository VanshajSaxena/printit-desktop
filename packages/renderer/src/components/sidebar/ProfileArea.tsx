import { DiamondIcon } from "@components/icons/DiamondIcon";
import ProfileHashIcon from "@components/icons/ProfileHashIcon";
import { SidebarLeftCollapseIcon } from "@components/icons/SidebarLeftCollapseIcon";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

type Status = "online" | "away" | "offline";

interface ProfileAreaProps {
  isCollapsed: boolean;
  setCollapsed: () => void;
}

export function ProfileArea({ isCollapsed, setCollapsed }: ProfileAreaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>("offline");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleStatusChange = (newStatus: Status) => {
    setStatus(newStatus);
    setIsOpen(false);
    // TODO: Broadcast the status change to your WebSocket/global state here
  };

  return (
    <div
      className={clsx(
        "relative flex h-fit w-full items-center justify-between transition-all duration-300",
        isCollapsed ? "px-1" : "pl-3",
      )}
      ref={popoverRef}
    >
      <div
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={clsx(
          !isCollapsed && "pl-2",
          "flex w-full cursor-pointer items-center justify-center rounded-xl transition-all duration-300",
        )}
      >
        <ProfileHashIcon size={40} />

        <div
          className={clsx(
            "flex items-center justify-between overflow-hidden transition-all duration-300",
            isCollapsed ? "w-0 px-0 opacity-0" : "w-full px-3 opacity-100",
          )}
        >
          <div className="flex flex-col items-start justify-center gap-6 md:flex-row md:items-center md:justify-center">
            <div className="flex flex-col items-start justify-center">
              <h1 className="text-lg leading-7 font-semibold whitespace-nowrap text-primary-content">
                Harry's Shop
              </h1>

              <p className="text-xs leading-4 whitespace-nowrap text-tertiary-content">
                harry@potter.com
              </p>
            </div>
            <DiamondIcon className="shrink-0 stroke-tertiary-content" />
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className={clsx(
            "absolute top-full z-50 mt-2 flex animate-in flex-col gap-0.5 rounded-xl border border-border-default bg-secondary p-1.5 shadow-xl fade-in slide-in-from-top-2",
            isCollapsed ? "left-2 w-48" : "left-4 w-56",
          )}
        >
          <button
            onClick={() => {
              handleStatusChange("online");
            }}
            className="group flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm text-primary-content transition-colors hover:bg-tertiary"
          >
            <div className="flex items-center gap-3">
              <div className="size-3 shrink-0 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              <span className="font-medium">Online</span>
            </div>
          </button>

          <button
            onClick={() => {
              handleStatusChange("away");
            }}
            className="group flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm text-primary-content transition-colors hover:bg-tertiary"
          >
            <div className="flex items-center gap-3">
              <div className="size-3 shrink-0 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
              <span className="font-medium">Away</span>
            </div>
          </button>

          <div className="my-1 h-px w-full bg-border-default/40" />

          <button
            onClick={() => {
              handleStatusChange("offline");
            }}
            className="group flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm text-tertiary-content transition-colors hover:bg-tertiary hover:text-primary-content"
          >
            <div className="flex items-center gap-3">
              <div className="size-3 shrink-0 rounded-full border-2 border-tertiary-content bg-transparent" />
              <span className="font-medium">Offline</span>
            </div>
          </button>
        </div>
      )}

      <div
        className={clsx(
          "flex shrink-0 items-center overflow-hidden transition-all duration-300",
          isCollapsed ? "w-0 opacity-0" : "ml-2 w-6 opacity-100",
        )}
      >
        <SidebarLeftCollapseIcon
          className="shrink-0 cursor-pointer stroke-tertiary-content transition-colors hover:stroke-primary-content"
          onClick={(e) => {
            e.stopPropagation();
            setCollapsed();
          }}
        />
      </div>
    </div>
  );
}
