export type ProjectKind = "web" | "javascript" | "python";
export type FileLanguage = "html" | "css" | "javascript" | "python";

export type ProjectFile = { name: string; language: FileLanguage; content: string };
export type Project = { kind: ProjectKind; files: ProjectFile[] };

export type LogLevel = "log" | "info" | "warn" | "error" | "system";
export type LogEntry = {
  id: number;
  level: LogLevel;
  text: string;
  /** Set when the message points at a line in one of the project's files. */
  file?: string;
  line?: number;
};
