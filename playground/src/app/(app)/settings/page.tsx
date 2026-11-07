import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/shared/page-placeholder";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <PagePlaceholder
      title="Settings"
      phase={7}
      description="Manage your account and how Playground works for you."
      planned={[
        "Account details and sign-in",
        "Editor and theme preferences",
      ]}
    />
  );
}
