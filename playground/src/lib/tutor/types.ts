export type TutorMessage = { role: "user" | "assistant"; content: string };

/** What the student chose to share with the tutor for one question. */
export type TutorContext = {
  lesson?: { course: string; title: string };
  files?: { name: string; language: string; content: string }[];
};
