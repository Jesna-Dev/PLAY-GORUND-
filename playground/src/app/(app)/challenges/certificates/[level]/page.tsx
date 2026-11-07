import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { CertificateView } from "@/components/challenges/certificate-view";
import { PageContainer } from "@/components/layout/page-container";
import { getChallengeSummaries } from "@/lib/challenges/content";
import { levels } from "@/lib/challenges/levels";

type Params = { params: Promise<{ level: string }> };

export function generateStaticParams() {
  return levels.map((level) => ({ level: level.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { level: id } = await params;
  const level = levels.find((l) => l.id === id);
  return level ? { title: `${level.title} certificate` } : {};
}

export default async function CertificatePage({ params }: Params) {
  const { level: id } = await params;
  const level = levels.find((l) => l.id === id);
  if (!level) notFound();

  const challenges = getChallengeSummaries()
    .filter((c) => c.difficulty === level.id)
    .map(({ slug, title, href }) => ({ slug, title, href }));

  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/challenges" className="hover:text-foreground">
            Challenges
          </Link>
          <ChevronRight aria-hidden="true" className="size-3.5" />
          <span>Certificates</span>
        </nav>
        <h1 className="mt-4 mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">{level.title} certificate</h1>
        <CertificateView level={level.id} levelTitle={level.title} challenges={challenges} />
      </div>
    </PageContainer>
  );
}
