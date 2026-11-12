import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Create an account" };

export default function SignUpPage() {
  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Save your progress and pick up on any device. Anything you&apos;ve done in this browser comes with you.
      </p>
      <AuthForm mode="sign-up" />
    </>
  );
}
