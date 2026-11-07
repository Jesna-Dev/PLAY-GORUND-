"use client";

import { useEffect, useRef } from "react";
import { Ban, Monitor, RotateCw, Smartphone, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { LogEntry, ProjectKind } from "@/lib/playground/types";
import { cn } from "@/lib/utils";
import { ConsoleView } from "./console-view";

export type OutputTab = "preview" | "console" | "errors";
export type Viewport = "full" | "tablet" | "mobile";

const viewports: { value: Viewport; label: string; width?: number; icon: typeof Monitor }[] = [
  { value: "full", label: "Full width", icon: Monitor },
  { value: "tablet", label: "Tablet, 768 px", width: 768, icon: Tablet },
  { value: "mobile", label: "Phone, 375 px", width: 375, icon: Smartphone },
];

function IconAction({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string;
  pressed?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            aria-pressed={pressed}
            onClick={onClick}
            className={cn(pressed && "bg-muted text-foreground")}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

export function OutputPane({
  kind,
  tab,
  onTabChange,
  logs,
  running,
  runShortcut,
  preview,
  previewKey,
  previewRef,
  viewport,
  onViewportChange,
  onRefreshPreview,
  onClear,
  onReveal,
}: {
  kind: ProjectKind;
  tab: OutputTab;
  onTabChange: (tab: OutputTab) => void;
  logs: LogEntry[];
  running: boolean;
  runShortcut: string;
  preview: string | null;
  previewKey: number;
  previewRef: React.RefObject<HTMLIFrameElement | null>;
  viewport: Viewport;
  onViewportChange: (viewport: Viewport) => void;
  onRefreshPreview: () => void;
  onClear: () => void;
  onReveal: (file: string, line: number) => void;
}) {
  const errors = logs.filter((entry) => entry.level === "error");
  const consoleRef = useRef<HTMLDivElement>(null);
  const width = viewports.find((v) => v.value === viewport)?.width;

  useEffect(() => {
    const el = consoleRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs.length]);

  const emptyConsole =
    kind === "web" ? (
      <>Output from <code className="font-mono">console.log</code> in script.js appears here.</>
    ) : running ? (
      "Running…"
    ) : (
      <>
        Press Run or <Kbd>{runShortcut}</Kbd> to see your program’s output here.
      </>
    );

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => onTabChange(value as OutputTab)}
      className="flex h-full flex-col gap-0 bg-card"
    >
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b px-2">
        <TabsList variant="line" aria-label="Output">
          {kind === "web" && <TabsTrigger value="preview">Preview</TabsTrigger>}
          <TabsTrigger value="console">Console</TabsTrigger>
          <TabsTrigger value="errors">
            Errors
            {errors.length > 0 && (
              <span className="rounded-full bg-destructive/15 px-1.5 text-xs text-destructive tabular-nums">
                {errors.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-0.5">
          {tab === "preview" ? (
            <>
              {viewports.map(({ value, label, icon: Icon }) => (
                <IconAction
                  key={value}
                  label={label}
                  pressed={viewport === value}
                  onClick={() => onViewportChange(value)}
                >
                  <Icon aria-hidden="true" />
                </IconAction>
              ))}
              <IconAction label="Reload preview" onClick={onRefreshPreview}>
                <RotateCw aria-hidden="true" />
              </IconAction>
            </>
          ) : (
            <IconAction label="Clear console" onClick={onClear}>
              <Ban aria-hidden="true" />
            </IconAction>
          )}
        </div>
      </div>

      {kind === "web" && (
        <TabsContent value="preview" keepMounted className="min-h-0 flex-1 overflow-auto bg-muted/50">
          {preview !== null && (
            <iframe
              key={previewKey}
              ref={previewRef}
              title="Preview of your web page"
              sandbox="allow-scripts allow-modals"
              srcDoc={preview}
              style={width ? { width } : undefined}
              className={cn(
                "mx-auto block h-full bg-white",
                width ? "max-w-none border-x" : "w-full",
              )}
            />
          )}
        </TabsContent>
      )}
      <TabsContent value="console" className="min-h-0 flex-1 overflow-auto" ref={consoleRef}>
        <ConsoleView entries={logs} empty={emptyConsole} onReveal={onReveal} />
      </TabsContent>
      <TabsContent value="errors" className="min-h-0 flex-1 overflow-auto">
        <ConsoleView entries={errors} empty="No errors from the last run." onReveal={onReveal} />
      </TabsContent>
    </Tabs>
  );
}
