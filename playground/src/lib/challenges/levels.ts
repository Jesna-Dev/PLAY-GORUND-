export type Difficulty = "beginner" | "intermediate" | "advanced";

export const levels: { id: Difficulty; title: string; description: string }[] = [
  { id: "beginner", title: "Beginner", description: "Warm-ups with strings, loops and lists." },
  { id: "intermediate", title: "Intermediate", description: "Stacks, maps, and tidying up messy text." },
  { id: "advanced", title: "Advanced", description: "Sorting, sliding windows and two-dimensional data." },
];

export const levelTitle = (id: Difficulty) => levels.find((l) => l.id === id)?.title ?? id;
