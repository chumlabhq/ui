import type { ReactNode } from "react";
import TopBar from "./TopBar";

interface AppShellProps {
  sidebar: ReactNode;
  children: ReactNode;
}

// App chrome: site-consistent top bar (announcement strip + brand + UserMenu)
// over a collapsible sidebar + the active view. Petrol-dark by brand; lives
// inside .pg-surface.
export default function AppShell({ sidebar, children }: AppShellProps) {
  return (
    <div className="pg-surface flex h-[100dvh] flex-col overflow-hidden bg-bg-base font-sans text-fg">
      <TopBar />
      <div className="flex min-h-0 flex-1">
        {sidebar}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
