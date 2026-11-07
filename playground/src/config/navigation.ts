import {
  BookOpen,
  LayoutDashboard,
  type LucideIcon,
  Settings,
  Sparkles,
  SquareTerminal,
  Target,
  User,
} from "lucide-react";

export type NavItem = { label: string; href: string; icon: LucideIcon };

export const primaryNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Playground", href: "/playground", icon: SquareTerminal },
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Challenges", href: "/challenges", icon: Target },
  { label: "AI Tutor", href: "/tutor", icon: Sparkles },
];

export const secondaryNav: NavItem[] = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];
