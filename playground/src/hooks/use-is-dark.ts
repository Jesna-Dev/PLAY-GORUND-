"use client";

import { useSyncExternalStore } from "react";

/** Tracks the `dark` class on <html>, which the theme toggle flips. */
export function useIsDark() {
  return useSyncExternalStore(
    (onChange) => {
      const observer = new MutationObserver(onChange);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
      return () => observer.disconnect();
    },
    () => document.documentElement.classList.contains("dark"),
    () => true,
  );
}
