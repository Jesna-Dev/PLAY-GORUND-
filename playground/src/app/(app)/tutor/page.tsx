import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/shared/page-placeholder";

export const metadata: Metadata = { title: "AI Tutor" };

export default function AITutorPage() {
  return (
    <PagePlaceholder
      title="AI Tutor"
      phase={5}
      description="A coding tutor that can see your code, your errors and your current lesson."
      planned={[
        "Explain, debug, fix and improve your code",
        "Generate code from plain-language instructions",
        "Hints and beginner-friendly concept explanations",
        "Quizzes on any topic",
      ]}
    />
  );
}
