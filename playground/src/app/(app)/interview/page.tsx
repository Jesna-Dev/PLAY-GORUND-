import type { Metadata } from "next";
import { InterviewLoader } from "@/components/interview/interview-loader";
import { PageContainer } from "@/components/layout/page-container";

export const metadata: Metadata = { title: "Interview" };

export default function InterviewPage() {
  return (
    <PageContainer>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Interview</h1>
        <p className="mt-1 max-w-2xl text-pretty text-muted-foreground">
          Practice common interview questions at every level. Answer out loud first, then open the question to check
          yourself.
        </p>
        <InterviewLoader />
      </div>
    </PageContainer>
  );
}
