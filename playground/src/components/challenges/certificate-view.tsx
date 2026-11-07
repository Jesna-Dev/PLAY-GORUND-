"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Download, Lock, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { languageNames } from "@/lib/challenges/code";
import type { Difficulty } from "@/lib/challenges/levels";
import type { ChallengeLanguage } from "@/lib/challenges/types";
import { progress, useLearnProgress } from "@/lib/learn/progress";
import { CertificateArt } from "./certificate-art";
import { ChallengeStatusIcon } from "./challenge-status";

const noop = () => () => {};

async function downloadPng(svg: SVGSVGElement, fileName: string) {
  const markup = new XMLSerializer().serializeToString(svg);
  const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = 2246;
    canvas.height = 1588;
    canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function CertificateView({
  level,
  levelTitle,
  challenges,
}: {
  level: Difficulty;
  levelTitle: string;
  challenges: { slug: string; title: string; href: string }[];
}) {
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const state = useLearnProgress();
  const [name, setName] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const currentName = name ?? state.name ?? "";
  useEffect(() => {
    if (name === null) return;
    const timer = setTimeout(() => progress.setName(name.trim()), 300);
    return () => clearTimeout(timer);
  }, [name]);

  if (!hydrated) return <Skeleton className="aspect-[1123/794] w-full rounded-xl" aria-label="Loading certificate" />;

  const solved = challenges.filter((c) => state.challenges[c.slug]);
  const earned = solved.length === challenges.length;
  const languages = (["javascript", "python"] as ChallengeLanguage[])
    .filter((lang) => solved.some((c) => state.challenges[c.slug].languages.includes(lang)))
    .map((lang) => languageNames[lang]);
  const completedAt = Math.max(...solved.map((c) => state.challenges[c.slug].at));
  const date = earned
    ? new Intl.DateTimeFormat(undefined, { day: "numeric", month: "long", year: "numeric" }).format(completedAt)
    : "";

  const art = (
    <CertificateArt
      ref={svgRef}
      level={level}
      levelTitle={levelTitle}
      name={earned ? currentName : "Your name"}
      count={challenges.length}
      languages={earned ? languages : ["JavaScript"]}
      titles={challenges.map((c) => c.title)}
      date={date || "—"}
    />
  );

  if (!earned) {
    return (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="relative overflow-hidden rounded-xl ring-1 ring-foreground/10" aria-hidden="true">
          <div className="opacity-40 grayscale">{art}</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-foreground/10">
              <Lock className="size-4" /> Locked
            </span>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Earn this certificate</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Solve all {challenges.length} {levelTitle.toLowerCase()} challenges, in JavaScript or Python.
          </p>
          <div className="mt-4">
            <Progress value={solved.length} max={challenges.length} aria-label="Challenges solved" />
            <p className="mt-2 text-xs text-muted-foreground tabular-nums">
              {solved.length} of {challenges.length} solved
            </p>
          </div>
          <ul className="mt-4 space-y-1">
            {challenges.map((challenge) => (
              <li key={challenge.slug}>
                <Link
                  href={challenge.href}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-accent"
                >
                  <ChallengeStatusIcon slug={challenge.slug} />
                  {challenge.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const fileName = `playground-${level}-certificate.png`;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="certificate-print overflow-hidden rounded-xl shadow-sm ring-1 ring-foreground/10">{art}</div>
      <div>
        <h2 className="text-lg font-semibold">Congratulations!</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You solved every {levelTitle.toLowerCase()} challenge. Add your name, then save your certificate.
        </p>
        <label htmlFor="certificate-name" className="mt-5 block text-sm font-medium">
          Name on the certificate
        </label>
        <input
          id="certificate-name"
          value={currentName}
          onChange={(event) => setName(event.target.value)}
          maxLength={60}
          autoComplete="name"
          placeholder="Your full name"
          className="mt-1.5 h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
        <div className="mt-4 grid gap-2">
          <Button
            disabled={!currentName.trim()}
            onClick={() => svgRef.current && downloadPng(svgRef.current, fileName)}
          >
            <Download aria-hidden="true" />
            Download image (PNG)
          </Button>
          <Button variant="outline" disabled={!currentName.trim()} onClick={() => window.print()}>
            <Printer aria-hidden="true" />
            Print or save as PDF
          </Button>
        </div>
        {!currentName.trim() && <p className="mt-2 text-xs text-muted-foreground">Add your name to download.</p>}
        <p className="mt-6 text-xs text-muted-foreground">
          Your certificate is made from progress saved in this browser. Online verification comes when accounts are added.
        </p>
      </div>
    </div>
  );
}
