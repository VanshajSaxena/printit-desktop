import { MainContent } from "./MainContent";
import { SideBar } from "./SideBar";
import { useState } from "react";

export type ViewType = "dashboard" | "history" | "settings" | "help";

export function AppLayout() {
  const [selectedView, setSelectedView] = useState<ViewType>("dashboard");
  return (
    <div
      className={
        "flex h-screen w-screen gap-4 overflow-hidden bg-secondary pt-4 pl-4 select-none"
      }
    >
      <SideBar
        selectedView={selectedView}
        onViewChange={setSelectedView}
      ></SideBar>
      <MainContent activeView={selectedView}></MainContent>
    </div>
  );
}
