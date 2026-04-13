import { client } from "@/api/client";
import type { VendorPresenceDto } from "@/api/gen/cloud-api-types";
import { usePresence } from "@/context/presence/usePresence";
import { DiamondIcon } from "@components/icons/DiamondIcon";
import { ProfileHashIcon } from "@components/icons/ProfileHashIcon";
import { SidebarLeftCollapseIcon } from "@components/icons/SidebarLeftCollapseIcon";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

interface ProfileAreaProps {
  isCollapsed: boolean;
  setCollapsed: () => void;
}

export function ProfileArea({ isCollapsed, setCollapsed }: ProfileAreaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { presence, setPresence } = usePresence();
  const popoverRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = client.useQuery(
    "get",
    "/api/v1/vendors/me",
    {},
    { staleTime: 300_000, refetchOnWindowFocus: false },
  );

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

  const handleStatusChange = (newStatus: VendorPresenceDto["status"]) => {
    setPresence(newStatus);
    setIsOpen(false);
  };

  if (isLoading || !data) {
    return null;
  }

  return (
    <div
      className="relative flex h-fit w-full items-center justify-between"
      ref={popoverRef}
    >
      <div
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={clsx(
          "flex min-w-0 grow cursor-pointer items-center rounded-xl transition-all duration-300",
          isCollapsed ? "justify-center p-1.5" : "px-3 py-1.5",
          "hover:bg-tertiary",
        )}
      >
        <ProfileHashIcon size={40} presence={presence} />

        <div
          className={clsx(
            "group flex min-w-0 items-center justify-between overflow-hidden transition-all duration-300",
            isCollapsed ? "w-0 px-0 opacity-0" : "w-full pl-3 opacity-100",
          )}
        >
          <div className="flex min-w-0 flex-col items-start justify-center gap-6 md:flex-row md:items-center md:justify-center">
            <div className="flex min-w-0 flex-col items-start justify-center">
              <h1 className="truncate text-lg leading-7 font-semibold text-primary-content">
                {data.displayName ?? data.username}
              </h1>

              <p className="truncate text-xs leading-4 text-tertiary-content">
                {data.username}
              </p>
            </div>
            <DiamondIcon className="shrink-0 stroke-tertiary-content group-hover:stroke-secondary-content" />
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className={clsx(
            "absolute top-full z-50 mt-2 flex animate-in flex-col gap-1 rounded-xl border border-border-default bg-secondary p-1.5 shadow-xl fade-in slide-in-from-top-2",
            isCollapsed ? "left-0 w-56" : "w-64",
          )}
        >
          <button
            onClick={() => {
              handleStatusChange("online");
            }}
            className="group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-tertiary"
          >
            <div className="mt-1.5 size-2.5 shrink-0 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm font-medium text-primary-content">
                Online
              </span>
              <span className="text-xs leading-relaxed text-tertiary-content">
                Visible to customers and accepting orders.
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              handleStatusChange("away");
            }}
            className="group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-tertiary"
          >
            <div className="mt-1.5 size-2.5 shrink-0 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm font-medium text-primary-content">
                Away
              </span>
              <span className="text-xs leading-relaxed text-tertiary-content">
                Temporarily unavailable for new jobs.
              </span>
            </div>
          </button>

          <div className="my-1 h-px w-full bg-border-default/40" />

          <button
            onClick={() => {
              handleStatusChange("offline");
            }}
            className="group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-tertiary"
          >
            <div className="mt-1.5 size-2.5 shrink-0 rounded-full border-2 border-tertiary-content bg-transparent" />
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm font-medium text-tertiary-content transition-colors group-hover:text-primary-content">
                Offline
              </span>
              <span className="text-xs leading-relaxed text-tertiary-content">
                Hidden from customers and pausing requests.
              </span>
            </div>
          </button>
        </div>
      )}

      <div
        className={clsx(
          "flex shrink-0 items-center overflow-hidden transition-all duration-300",
          isCollapsed ? "w-0 opacity-0" : "ml-1 w-6 opacity-100",
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
