"use client";

import { useCallback, useEffect, useEffectEvent, useRef } from "react";
import type { LogLevel } from "@/lib/playground/types";

export type RunLanguage = "javascript" | "python";

export type RunnerEvent = { lang: RunLanguage; runId: number } & (
  | { type: "log"; level: LogLevel; text: string; file?: string; line?: number }
  | { type: "status"; text: string }
  | { type: "started" }
  | { type: "done"; ms: number; failed?: boolean }
  | { type: "timeout"; seconds: number }
  | { type: "stopped" }
);

/**
 * Talks to public/runner.html, a sandboxed iframe that runs code in a Web
 * Worker. Render <iframe {...frameProps} /> once.
 */
export function useCodeRunner(onEvent: (event: RunnerEvent) => void) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const ready = useRef(false);
  const queue = useRef<object[]>([]);
  const nextRunId = useRef(0);

  const post = useCallback((message: object) => {
    const target = frameRef.current?.contentWindow;
    if (!ready.current || !target) {
      queue.current.push(message);
      return;
    }
    // The sandboxed frame has an opaque origin, so "*" is the only valid target.
    target.postMessage(message, "*");
  }, []);

  const handle = useEffectEvent((data: RunnerEvent | { type: "ready" }) => {
    if (data.type === "ready") {
      ready.current = true;
      for (const message of queue.current.splice(0)) post(message);
      return;
    }
    onEvent(data);
  });

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.source !== "pg-runner") return;
      handle(event.data);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const run = useCallback(
    (lang: RunLanguage, code: string) => {
      nextRunId.current += 1;
      post({ type: "run", lang, code, runId: nextRunId.current });
      return nextRunId.current;
    },
    [post],
  );

  const stop = useCallback(
    (lang: RunLanguage, runId: number) => post({ type: "stop", lang, runId }),
    [post],
  );

  const warm = useCallback((lang: RunLanguage) => post({ type: "warm", lang }), [post]);

  const frameProps = {
    ref: frameRef,
    src: "/runner.html",
    sandbox: "allow-scripts",
    title: "Code runner",
    hidden: true,
    "aria-hidden": true,
    tabIndex: -1,
  } as const;

  return { frameProps, run, stop, warm };
}
