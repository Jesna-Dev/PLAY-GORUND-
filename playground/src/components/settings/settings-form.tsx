"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useIsDark } from "@/hooks/use-is-dark";
import { EDITOR_FONT_SIZES, type EditorSettings, updateEditorSettings, useEditorSettings } from "@/lib/editor-settings";
import { progress, useLearnProgress } from "@/lib/learn/progress";
import { setTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const FONT_SIZE_LABELS: Record<EditorSettings["fontSize"], string> = { 13: "Small", 14: "Medium", 16: "Large", 18: "Extra large" };

// Everything a learner has made. Theme and editor preferences are deliberately kept.
const PROGRESS_KEYS = ["learn:v1", "learn:drafts:v1", "playground:v1", "tutor:v1", "interview:v1"];
const TUTOR_KEY = "tutor:v1";

function removeKeys(keys: string[]) {
  try {
    for (const key of keys) localStorage.removeItem(key);
  } catch {
    // Storage blocked, so there's nothing saved to remove.
  }
  // The stores hold what they've read, so start clean.
  window.location.reload();
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section aria-label={title} className="mt-6">
      <h2 className="text-base font-medium">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-3 divide-y rounded-2xl bg-card ring-1 ring-foreground/10">{children}</div>
    </section>
  );
}

function Row({ label, detail, id, children }: { label: string; detail?: string; id?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <p id={id} className="text-sm font-medium">
          {label}
        </p>
        {detail && <p className="mt-0.5 text-sm text-pretty text-muted-foreground">{detail}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: React.ReactNode }[];
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1 rounded-lg bg-background/60 p-1 ring-1 ring-foreground/10">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
            option.value === value ? "bg-primary font-medium text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Switch({ labelledBy, checked, onChange }: { labelledBy: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative block h-6 w-10 rounded-full outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
        checked ? "bg-primary" : "bg-muted ring-1 ring-foreground/15 ring-inset",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1 left-1 size-4 rounded-full transition-transform",
          checked ? "translate-x-4 bg-primary-foreground" : "bg-muted-foreground",
        )}
      />
    </button>
  );
}

export function SettingsForm({ defaultName }: { defaultName: string }) {
  const state = useLearnProgress();
  const isDark = useIsDark();
  const editor = useEditorSettings();
  const [confirm, setConfirm] = useState<"tutor" | "all" | null>(null);

  return (
    <>
      <Section title="Profile">
        <Row label="Name on your certificates" detail="Also shown on your profile.">
          <label htmlFor="settings-name" className="sr-only">
            Name on your certificates
          </label>
          <input
            id="settings-name"
            value={state.name ?? ""}
            onChange={(e) => progress.setName(e.target.value)}
            placeholder={defaultName}
            maxLength={60}
            autoComplete="name"
            className="h-9 w-full rounded-lg bg-background/60 px-3 text-sm ring-1 ring-foreground/10 outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-60"
          />
        </Row>
      </Section>

      <Section title="Appearance">
        <Row label="Theme" detail="The home page always stays dark.">
          <Segmented
            label="Theme"
            value={isDark ? "dark" : "light"}
            onChange={setTheme}
            options={[
              { value: "dark" as const, label: <><Moon aria-hidden="true" className="size-3.5" />Dark</> },
              { value: "light" as const, label: <><Sun aria-hidden="true" className="size-3.5" />Light</> },
            ]}
          />
        </Row>
      </Section>

      <Section title="Code editor" description="Applies in the Playground, lessons and challenges.">
        <Row label="Font size">
          <Segmented
            label="Font size"
            value={editor.fontSize}
            onChange={(fontSize) => updateEditorSettings({ fontSize })}
            options={EDITOR_FONT_SIZES.map((size) => ({ value: size, label: FONT_SIZE_LABELS[size] }))}
          />
        </Row>
        <div className="p-4">
          <pre
            aria-hidden="true"
            style={{ fontSize: editor.fontSize }}
            className="overflow-x-auto rounded-lg bg-background/60 p-3 font-mono leading-relaxed ring-1 ring-foreground/10"
          >
            <span className="text-syntax-keyword">const</span> greeting = <span className="text-chart-3">&quot;Hello, Codly&quot;</span>;
          </pre>
        </div>
        <Row id="setting-wrap" label="Word wrap" detail="Fit long lines inside the editor.">
          <Switch labelledBy="setting-wrap" checked={editor.wordWrap} onChange={(wordWrap) => updateEditorSettings({ wordWrap })} />
        </Row>
        <Row id="setting-lines" label="Line numbers">
          <Switch labelledBy="setting-lines" checked={editor.lineNumbers} onChange={(lineNumbers) => updateEditorSettings({ lineNumbers })} />
        </Row>
        <Row id="setting-minimap" label="Minimap" detail="A small overview of the file beside the code.">
          <Switch labelledBy="setting-minimap" checked={editor.minimap} onChange={(minimap) => updateEditorSettings({ minimap })} />
        </Row>
      </Section>

      <Section title="Your data" description="Accounts and sign-in aren't available yet, so everything is saved in this browser.">
        <Row label="AI Tutor conversation" detail="Delete the saved chat.">
          <Button variant="outline" onClick={() => setConfirm("tutor")}>
            Clear chat
          </Button>
        </Row>
        <Row label="Reset all progress" detail="Removes lessons, challenges, interview marks, certificate name, saved code and the tutor chat.">
          <Button variant="destructive" onClick={() => setConfirm("all")}>
            Reset progress
          </Button>
        </Row>
      </Section>

      <Dialog open={confirm !== null} onOpenChange={(open) => !open && setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirm === "tutor" ? "Clear the tutor chat?" : "Reset all progress?"}</DialogTitle>
            <DialogDescription>
              {confirm === "tutor"
                ? "Your saved conversation will be deleted. This can't be undone."
                : "Your lessons, challenges, interview marks, certificate name, saved code and tutor chat will be deleted from this browser. This can't be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => removeKeys(confirm === "tutor" ? [TUTOR_KEY] : PROGRESS_KEYS)}>
              {confirm === "tutor" ? "Clear chat" : "Reset everything"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
