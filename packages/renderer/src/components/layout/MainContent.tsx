import { Dashboard } from "@pages/Dashboard";
import type { ViewType } from "./AppLayout";

export function MainContent({ activeView }: { activeView: ViewType }) {
  return (
    <main className="flex size-full flex-col rounded-tl-3xl border-t border-l border-border-default bg-primary">
      {activeView === "dashboard" && <Dashboard></Dashboard>}
    </main>
  );
}
