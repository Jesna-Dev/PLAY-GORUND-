import type { Metadata } from "next";
import { TutorLoader } from "@/components/tutor/tutor-loader";
import { getCourseSummaries } from "@/lib/learn/content";

export const metadata: Metadata = { title: "AI Tutor" };

export default function AITutorPage() {
  return <TutorLoader courses={getCourseSummaries()} />;
}
