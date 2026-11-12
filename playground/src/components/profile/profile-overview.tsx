"use client";

import Link from "next/link";
import { useState } from "react";
import { Award, CircleCheck, FolderCode, Lock, Medal, Trophy } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";
import { LanguageMark } from "@/components/shared/language-mark";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { interviewQuestions } from "@/content/interview/questions";
import type { CourseLevel } from "@/content/learn/courses";
import { levels as challengeLevels } from "@/lib/challenges/levels";
import type { ChallengeSummary } from "@/lib/challenges/types";
import { loadStatuses } from "@/lib/interview/storage";
import { progress, useLearnProgress } from "@/lib/learn/progress";
import type { CourseSummary } from "@/lib/learn/types";
import { loadWorkspace } from "@/lib/playground/storage";
import type { ProjectKind } from "@/lib/playground/types";
import { cn } from "@/lib/utils";
import { initialsOf, useCurrentUser } from "@/lib/auth-client";
import { ACCOUNT_TYPE_INFO } from "@/lib/account-types";
import { ACCOUNT_TYPE_ICONS } from "@/components/auth/account-type-picker";

const COURSE_LEVELS: CourseLevel[] = ["Babies", "Intermediate", "Experienced", "Pro"];
const PROJECT_NAMES: Record<ProjectKind, string> = { web: "HTML & CSS", javascript: "JavaScript", python: "Python" };
const INTERVIEW_READY = 10;

const card = "rounded-2xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5";

function Stat({ label, value, total, href }: { label: string; value: number; total: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-2xl bg-card p-4 ring-1 ring-foreground/10 outline-none transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="mt-2 block text-2xl font-medium tracking-tight tabular-nums">
        {value}
        <span className="ml-1 text-sm font-normal tracking-normal text-muted-foreground">/ {total}</span>
      </span>
    </Link>
  );
}

function AccountTypeBadge({ type }: { type: keyof typeof ACCOUNT_TYPE_INFO }) {
  const Icon = ACCOUNT_TYPE_ICONS[type];
  return (
    <Link
      href="/settings"
      title="Change in Settings"
      className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-2.5 py-0.5 text-xs font-medium text-primary-text ring-1 ring-primary/30 outline-none hover:bg-primary/20 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {ACCOUNT_TYPE_INFO[type].label}
    </Link>
  );
}

export function ProfileOverview({
  courses,
  challenges,
}: {
  courses: CourseSummary[];
  challenges: ChallengeSummary[];
}) {
  const state = useLearnProgress();
  const user = useCurrentUser();
  const accountName = user?.name ?? "Guest";
  const [statuses] = useState(loadStatuses);
  const [workspace] = useState(loadWorkspace);

  const customName = state.name?.trim();
  const name = customName || accountName;
  const initials = initialsOf(name);

  const lessons = courses.flatMap((c) => c.lessons);
  const done = lessons.filter((l) => state.completed[l.key]);
  const exercises = lessons.filter((l) => l.hasExercise);
  const solvedExercises = exercises.filter((l) => state.passed[l.key]).length;
  const solvedChallenges = challenges.filter((c) => state.challenges[c.slug]).length;
  const knownQuestions = Object.values(statuses).filter((s) => s === "known").length;
  const finishedCourse = courses.some((c) => c.lessons.every((l) => state.completed[l.key]));
  const coursesTried = courses.filter((c) => c.lessons.some((l) => state.completed[l.key])).length;
  const perfectQuiz = lessons.some(
    (l) => l.quiz.length > 0 && l.quiz.every((q) => state.answers[l.key]?.[q.id] === q.answer),
  );

  const achievements = [
    { title: "First steps", detail: "Complete a lesson", earned: done.length > 0 },
    { title: "It works", detail: "Pass a coding exercise", earned: solvedExercises > 0 },
    { title: "Challenger", detail: "Solve a challenge", earned: solvedChallenges > 0 },
    { title: "Top marks", detail: "Get every quiz question right in a lesson", earned: perfectQuiz },
    { title: "Explorer", detail: "Complete lessons in 3 courses", earned: coursesTried >= 3 },
    { title: "Going Pro", detail: "Complete a Pro level lesson", earned: done.some((l) => l.moduleTitle === "Pro") },
    { title: "Graduate", detail: "Finish a whole course", earned: finishedCourse },
    { title: "Interview ready", detail: `Know ${INTERVIEW_READY} interview questions`, earned: knownQuestions >= INTERVIEW_READY },
  ];
  const earnedCount = achievements.filter((a) => a.earned).length;

  const projects = (Object.keys(PROJECT_NAMES) as ProjectKind[]).filter((kind) => workspace.hasSaved[kind]);

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="grid min-w-0 content-start gap-3">
        <section className={cn(card, "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between")}>
          <div className="flex min-w-0 items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="bg-primary text-xl font-medium text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">{name}</h1>
              {user && <AccountTypeBadge type={user.accountType} />}
              <p className="mt-0.5 text-sm text-muted-foreground">
                {done.length} of {lessons.length} lessons completed
              </p>
            </div>
          </div>
          <div className="sm:w-56">
            <label htmlFor="profile-name" className="text-xs text-muted-foreground">
              Name on your certificates
            </label>
            <input
              id="profile-name"
              value={state.name ?? ""}
              onChange={(e) => progress.setName(e.target.value)}
              placeholder={accountName}
              maxLength={60}
              autoComplete="name"
              className="mt-1 h-9 w-full rounded-lg bg-background/60 px-3 text-sm ring-1 ring-foreground/10 outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Lessons" value={done.length} total={lessons.length} href="/learn" />
          <Stat label="Exercises" value={solvedExercises} total={exercises.length} href="/learn" />
          <Stat label="Challenges" value={solvedChallenges} total={challenges.length} href="/challenges" />
          <Stat label="Interview" value={knownQuestions} total={interviewQuestions.length} href="/interview" />
        </div>

        <section aria-labelledby="course-levels" className={card}>
          <h2 id="course-levels" className="text-sm font-medium">
            Progress by level
          </h2>
          <ul className="mt-4 space-y-5">
            {courses.map((course) => (
              <li key={course.id}>
                <Link
                  href={course.href}
                  className="flex items-center gap-2 rounded-md text-sm font-medium outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <LanguageMark language={course.id} className="size-6 rounded-md text-[10px]" />
                  {course.title}
                </Link>
                <div className="mt-2 grid grid-cols-4 gap-2 sm:gap-3">
                  {COURSE_LEVELS.map((level) => {
                    const inLevel = course.lessons.filter((l) => l.moduleTitle === level);
                    const finished = inLevel.filter((l) => state.completed[l.key]).length;
                    return (
                      <div key={level} className="min-w-0">
                        <p className="flex flex-col text-[11px] text-muted-foreground sm:flex-row sm:items-baseline sm:justify-between sm:gap-1 sm:text-xs">
                          <span className="truncate">{level}</span>
                          <span className="tabular-nums">
                            {finished}/{inLevel.length}
                          </span>
                        </p>
                        <Progress
                          className="mt-1.5"
                          value={finished}
                          max={inLevel.length}
                          aria-label={`${course.title}, ${level} level`}
                        />
                      </div>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid min-w-0 content-start gap-3">
        <section aria-labelledby="achievements" className={card}>
          <div className="flex items-center justify-between gap-2">
            <h2 id="achievements" className="flex items-center gap-2 text-sm font-medium">
              <Trophy aria-hidden="true" className="size-4 text-muted-foreground" />
              Achievements
            </h2>
            <p className="text-xs text-muted-foreground tabular-nums">
              {earnedCount} of {achievements.length}
            </p>
          </div>
          <ul className="mt-4 space-y-3">
            {achievements.map(({ title, detail, earned }) => (
              <li key={title} className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full",
                    earned ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {earned ? <Medal aria-label="Earned" className="size-4" /> : <Lock aria-label="Locked" className="size-3.5" />}
                </span>
                <div className="min-w-0">
                  <p className={cn("text-sm font-medium", !earned && "text-muted-foreground")}>{title}</p>
                  <p className="text-xs text-muted-foreground">{detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="certificates" className={card}>
          <h2 id="certificates" className="flex items-center gap-2 text-sm font-medium">
            <Award aria-hidden="true" className="size-4 text-muted-foreground" />
            Certificates
          </h2>
          <ul className="mt-3 space-y-1">
            {challengeLevels.map((level) => {
              const inLevel = challenges.filter((c) => c.difficulty === level.id);
              const solved = inLevel.filter((c) => state.challenges[c.slug]).length;
              const earned = inLevel.length > 0 && solved === inLevel.length;
              return (
                <li key={level.id}>
                  <Link
                    href={`/challenges/certificates/${level.id}`}
                    className="-mx-2 flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <span className={cn("flex items-center gap-2", earned && "font-medium")}>
                      {earned ? (
                        <CircleCheck aria-hidden="true" className="size-4 text-primary-text" />
                      ) : (
                        <Lock aria-hidden="true" className="size-3.5 text-muted-foreground" />
                      )}
                      {level.title}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {earned ? "Earned" : `${solved} of ${inLevel.length} solved`}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="projects" className={card}>
          <h2 id="projects" className="flex items-center gap-2 text-sm font-medium">
            <FolderCode aria-hidden="true" className="size-4 text-muted-foreground" />
            Saved projects
          </h2>
          {projects.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {projects.map((kind) => (
                <li key={kind} className="flex items-center justify-between gap-2 text-sm">
                  <span>{PROJECT_NAMES[kind]}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {workspace.projects[kind].files.length} file{workspace.projects[kind].files.length === 1 ? "" : "s"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Nothing saved yet.</p>
          )}
          <ButtonLink variant="outline" size="sm" className="mt-3" href="/playground">
            Open Playground
          </ButtonLink>
        </section>
      </div>
    </div>
  );
}
