import { Logo } from "@/components/layout/logo";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { TopBar } from "@/components/layout/top-bar";
import { UserMenu } from "@/components/layout/user-menu";
import { SyncProvider } from "@/components/layout/sync-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh">
      <SyncProvider />
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <aside aria-label="Sidebar" className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col gap-6 border-r bg-sidebar p-4 lg:flex">
        <div className="flex h-8 items-center px-3">
          <Logo />
        </div>
        <SidebarNav />
        <div className="-mx-1 flex items-center justify-between border-t border-sidebar-border pt-3">
          <UserMenu placement="sidebar" />
          <ThemeToggle />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main id="main" className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
