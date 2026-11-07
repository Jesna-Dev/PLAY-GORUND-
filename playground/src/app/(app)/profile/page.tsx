import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/shared/page-placeholder";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <PagePlaceholder
      title="Profile"
      phase={7}
      description="Everything you’ve built and learned, in one place."
      planned={[
        "Saved snippets and projects",
        "Completed courses and learning statistics",
        "Coding achievements",
      ]}
    />
  );
}
