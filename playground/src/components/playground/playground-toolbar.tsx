"use client";

import { useState } from "react";
import { Play, RotateCcw, Save, Square, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { kindOrder, projectKinds } from "@/lib/playground/templates";
import type { ProjectKind } from "@/lib/playground/types";

const kindItems = Object.fromEntries(kindOrder.map((k) => [k, projectKinds[k].label]));

export type SaveState = "saved" | "unsaved" | "starter" | "error";

const saveLabels: Record<SaveState, string> = {
  saved: "Saved in this browser",
  unsaved: "Unsaved changes",
  starter: "",
  error: "Couldn’t save. Browser storage may be full or blocked.",
};

function ToolButton({
  label,
  shortcut,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { label: string; shortcut?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="ghost" aria-label={label} {...props} />}>
        {children}
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {label}
        {shortcut && <Kbd>{shortcut}</Kbd>}
      </TooltipContent>
    </Tooltip>
  );
}

export function PlaygroundToolbar({
  kind,
  onKindChange,
  saveState,
  running,
  canFormat,
  modKey,
  onRun,
  onStop,
  onSave,
  onFormat,
  onReset,
}: {
  kind: ProjectKind;
  onKindChange: (kind: ProjectKind) => void;
  saveState: SaveState;
  running: boolean;
  canFormat: boolean;
  modKey: string;
  onRun: () => void;
  onStop: () => void;
  onSave: () => void;
  onFormat: () => void;
  onReset: () => void;
}) {
  const [resetOpen, setResetOpen] = useState(false);

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-b px-3 py-2 sm:px-4">
      <Select
        items={kindItems}
        value={kind}
        onValueChange={(value) => value && onKindChange(value as ProjectKind)}
      >
        <SelectTrigger className="w-36" aria-label="Project type">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {kindOrder.map((k) => (
            <SelectItem key={k} value={k}>
              {projectKinds[k].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <p
        role="status"
        className={
          saveState === "error"
            ? "text-xs text-destructive"
            : "hidden text-xs text-muted-foreground sm:block"
        }
      >
        {saveLabels[saveState]}
      </p>

      <div className="ml-auto flex items-center gap-1">
        <ToolButton label="Reset to starter code" size="icon" onClick={() => setResetOpen(true)}>
          <RotateCcw aria-hidden="true" />
        </ToolButton>
        <ToolButton
          label={canFormat ? "Format code" : "Formatting isn’t available for Python yet"}
          shortcut={canFormat ? "Shift Alt F" : undefined}
          size="icon"
          disabled={!canFormat}
          onClick={onFormat}
        >
          <WandSparkles aria-hidden="true" />
        </ToolButton>
        <ToolButton label="Save" shortcut={`${modKey} S`} size="icon" onClick={onSave}>
          <Save aria-hidden="true" />
        </ToolButton>
        {running ? (
          <Button variant="secondary" className="ml-1 min-w-20" onClick={onStop}>
            <Square aria-hidden="true" className="fill-current" />
            Stop
          </Button>
        ) : (
          <Tooltip>
            <TooltipTrigger render={<Button className="ml-1 min-w-20" onClick={onRun} />}>
              <Play aria-hidden="true" className="fill-current" />
              Run
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Run <Kbd>{modKey} Enter</Kbd>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset to starter code?</DialogTitle>
            <DialogDescription>
              This replaces the code in every file of this {projectKinds[kind].label} project.
              Your last saved copy stays until you save again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                onReset();
                setResetOpen(false);
              }}
            >
              Reset code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
