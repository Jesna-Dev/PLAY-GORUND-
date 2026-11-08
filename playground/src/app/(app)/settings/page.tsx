import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { SettingsForm } from "@/components/settings/settings-form";
import { getDashboardData } from "@/lib/data/dashboard";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { user } = await getDashboardData();

  return (
    <PageContainer>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Settings</h1>
        <SettingsForm defaultName={user.name} />
      </div>
    </PageContainer>
  );
}
