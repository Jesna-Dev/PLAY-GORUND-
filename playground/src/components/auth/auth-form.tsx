"use client";

import Link from "next/link";
import { useState } from "react";
import { AccountTypePicker } from "@/components/auth/account-type-picker";
import { Button } from "@/components/ui/button";
import type { AccountType } from "@/lib/account-types";
import { authClient } from "@/lib/auth-client";
import { pullAndMerge, setSyncEnabled } from "@/lib/sync/client";

type Mode = "sign-in" | "sign-up";

const inputClass =
  "mt-1.5 h-10 w-full rounded-lg bg-background/60 px-3 text-sm ring-1 ring-foreground/15 outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:ring-destructive";

/** Only same-site paths, so a link can't send someone elsewhere after signing in. */
function nextPath() {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

function messageFor(code: string | undefined, fallback: string | undefined, mode: Mode) {
  switch (code) {
    case "INVALID_EMAIL_OR_PASSWORD":
      return "That email and password don't match. Check them and try again.";
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return "There's already an account with that email. Sign in instead.";
    case "PASSWORD_TOO_SHORT":
      return "Use a password of at least 8 characters.";
    case "INVALID_EMAIL":
      return "Enter a valid email address.";
    default:
      return fallback || (mode === "sign-in" ? "Couldn't sign in. Try again." : "Couldn't create your account. Try again.");
  }
}

export function AuthForm({ mode }: { mode: Mode }) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>("student");
  const isSignUp = mode === "sign-up";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "").trim();

    setBusy(true);
    setError(null);
    try {
      const result = isSignUp
        ? await authClient.signUp.email({ email, password, name, accountType })
        : await authClient.signIn.email({ email, password });
      if (result.error) {
        setError(
          result.error.status === 503 || result.error.status === 500
            ? "Accounts aren't available right now. The database may not be set up yet."
            : messageFor(result.error.code, result.error.message, mode),
        );
        setBusy(false);
        return;
      }
      // Bring this browser's progress and the account together before showing the app.
      setSyncEnabled(true);
      await pullAndMerge().catch(() => {});
      window.location.assign(nextPath());
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate={false} className="mt-6 space-y-4">
      {isSignUp && <AccountTypePicker value={accountType} onChange={setAccountType} />}
      {isSignUp && (
        <div>
          <label htmlFor="auth-name" className="text-sm font-medium">
            Name
          </label>
          <input id="auth-name" name="name" required maxLength={60} autoComplete="name" className={inputClass} />
        </div>
      )}
      <div>
        <label htmlFor="auth-email" className="text-sm font-medium">
          Email
        </label>
        <input id="auth-email" name="email" type="email" required autoComplete="email" aria-invalid={Boolean(error) || undefined} className={inputClass} />
      </div>
      <div>
        <label htmlFor="auth-password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="auth-password"
          name="password"
          type="password"
          required
          minLength={8}
          maxLength={128}
          autoComplete={isSignUp ? "new-password" : "current-password"}
          aria-describedby={isSignUp ? "auth-password-hint" : undefined}
          aria-invalid={Boolean(error) || undefined}
          className={inputClass}
        />
        {isSignUp && (
          <p id="auth-password-hint" className="mt-1.5 text-xs text-muted-foreground">
            At least 8 characters.
          </p>
        )}
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? (isSignUp ? "Creating your account…" : "Signing in…") : isSignUp ? "Create account" : "Sign in"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {isSignUp ? "Already have an account? " : "New to Codly? "}
        <Link href={isSignUp ? "/sign-in" : "/sign-up"} className="font-medium text-foreground underline-offset-4 hover:underline">
          {isSignUp ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
