export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

/**
 * Runs before first paint so a saved light theme never flashes dark.
 * The server always renders the default, dark.
 */
export const themeInitScript = `(function(){try{if(localStorage.getItem("${STORAGE_KEY}")==="light")document.documentElement.classList.remove("dark")}catch(e){}})()`;

export function toggleTheme(): Theme {
  const next: Theme = document.documentElement.classList.toggle("dark")
    ? "dark"
    : "light";
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Storage can be blocked. The theme still applies for this page view.
  }
  return next;
}
