export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

/**
 * Runs before first paint so a saved light theme never flashes dark.
 * The server always renders the default, dark.
 */
export const themeInitScript = `(function(){try{if(localStorage.getItem("${STORAGE_KEY}")==="light")document.documentElement.classList.remove("dark")}catch(e){}})()`;

export function setTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked. The theme still applies for this page view.
  }
}

export function toggleTheme(): Theme {
  const next: Theme = document.documentElement.classList.contains("dark") ? "light" : "dark";
  setTheme(next);
  return next;
}
