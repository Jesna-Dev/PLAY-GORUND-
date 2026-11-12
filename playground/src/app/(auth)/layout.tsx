import Link from "next/link";
import { Logo } from "@/components/layout/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,color-mix(in_oklch,var(--primary)_12%,transparent),transparent)] px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="mt-8 rounded-2xl bg-card p-6 ring-1 ring-foreground/10 sm:p-8">{children}</div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/dashboard" className="underline-offset-4 hover:text-foreground hover:underline">
            Continue without an account
          </Link>
        </p>
      </div>
    </main>
  );
}
