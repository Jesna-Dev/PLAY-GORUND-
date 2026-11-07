import { kindOrder, starterProject } from "./templates";
import type { Project, ProjectKind } from "./types";

// Browser storage until accounts and Supabase land in Phase 7.
const KEY = "playground:v1";

type Stored = {
  kind?: ProjectKind;
  projects?: Partial<Record<ProjectKind, Record<string, string>>>;
};

function read(): Stored {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? (parsed as Stored) : {};
  } catch {
    return {};
  }
}

function write(stored: Stored): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(stored));
    return true;
  } catch {
    return false;
  }
}

export type Workspace = {
  kind: ProjectKind;
  projects: Record<ProjectKind, Project>;
  /** Whether each project has a saved copy (false means it shows starter code). */
  hasSaved: Record<ProjectKind, boolean>;
};

export function loadWorkspace(): Workspace {
  const stored = read();
  const projects = {} as Record<ProjectKind, Project>;
  const hasSaved = {} as Record<ProjectKind, boolean>;

  for (const kind of kindOrder) {
    const project = starterProject(kind);
    const saved = stored.projects?.[kind];
    hasSaved[kind] = Boolean(saved);
    if (saved) {
      for (const file of project.files) {
        const content = saved[file.name];
        if (typeof content === "string") file.content = content;
      }
    }
    projects[kind] = project;
  }

  const kind = kindOrder.includes(stored.kind as ProjectKind)
    ? (stored.kind as ProjectKind)
    : "web";
  return { kind, projects, hasSaved };
}

export function saveProject(project: Project): boolean {
  const stored = read();
  stored.projects = {
    ...stored.projects,
    [project.kind]: Object.fromEntries(project.files.map((f) => [f.name, f.content])),
  };
  return write(stored);
}

export function saveLastKind(kind: ProjectKind) {
  write({ ...read(), kind });
}
