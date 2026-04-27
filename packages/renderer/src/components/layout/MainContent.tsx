import { Settings } from "@/pages/settings/Settings";
import { startWatchingPrintQueue } from "@/store/startWatchingPrintQueue";
import { Dashboard } from "@pages/Dashboard";
import { useEffect } from "react";
import type { ViewType } from "./AppLayout";

export function MainContent({ activeView }: { activeView: ViewType }) {
  useEffect(() => {
    const unsubscribe = startWatchingPrintQueue();
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <main className="@container/main flex h-full w-full max-w-full min-w-0 flex-col rounded-tl-3xl border-t border-l border-border-default bg-primary">
      {activeView === "dashboard" && <Dashboard />}
      {activeView === "settings" && <Settings />}
    </main>
  );
}
