import { getDashboardData } from "@/lib/data/dashboard";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export async function TopBar() {
  const { user } = await getDashboardData();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-2 border-b bg-background/85 px-4 backdrop-blur sm:px-6 lg:hidden">
      <div className="flex items-center gap-1">
        <MobileNav />
        <Logo />
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <UserMenu name={user.name} initials={user.initials} />
      </div>
    </header>
  );
}
