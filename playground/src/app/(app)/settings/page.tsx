import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { SettingsForm } from "@/components/settings/settings-form";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <PageContainer>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Settings</h1>
        <SettingsForm />
      </div>
    </PageContainer>
  );
}
