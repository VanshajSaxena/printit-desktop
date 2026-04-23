import { Dashboard } from "@pages/Dashboard";
import type { ViewType } from "./AppLayout";
import { startWatchingPrintQueue } from "@/store/startWatchingPrintQueue";
import { useEffect } from "react";

export function MainContent({ activeView }: { activeView: ViewType }) {
  useEffect(() => {
    const unsubscribe = startWatchingPrintQueue();
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <main className="@container/main flex h-full w-full max-w-full min-w-0 flex-col rounded-tl-3xl border-t border-l border-border-default bg-primary">
      {activeView === "dashboard" && <Dashboard></Dashboard>}
    </main>
  );
}
