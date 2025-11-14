import { Dashboard } from '@pages/Dashboard';
import type { ViewType } from './AppLayout';

export function MainContent({ activeView }: { activeView: ViewType }) {
  return (
    <main className="flex flex-col rounded-tl-3xl border-t border-l size-full bg-primary border-border-default">
      {activeView === 'dashboard' && <Dashboard></Dashboard>}
    </main>
  );
}
