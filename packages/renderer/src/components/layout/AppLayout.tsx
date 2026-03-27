import { useTransactionStore } from "@/store/useTransactionStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { MainContent } from "./MainContent";
import { SideBar } from "./SideBar";

export type ViewType = "dashboard" | "analytics" | "settings" | "help";

export function AppLayout() {
  const [selectedView, setSelectedView] = useState<ViewType>("dashboard");
  const printQueue = useTransactionStore((store) => store.state.printQueue);

  useEffect(() => {
    const timedout = printQueue.items.some(
      (item) => item.monitoring?.timedOut === true,
    );

    if (timedout) {
      toast.error("It looks like your printer is not connected.", {
        id: "printer-timeout",
        position: "top-center",
        duration: 5000,
      });
    }
  }, [printQueue]);

  return (
    <div
      className={
        "flex h-dvh w-dvw gap-4 overflow-hidden bg-secondary pt-4 pl-4 select-none"
      }
    >
      <SideBar
        selectedView={selectedView}
        onViewChange={setSelectedView}
      ></SideBar>
      <MainContent activeView={selectedView}></MainContent>
      <Toaster />
    </div>
  );
}
