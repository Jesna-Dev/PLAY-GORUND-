import { cacheLife } from "next/cache";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import Markdown from "react-markdown";
import { codeThemes, getHighlighter } from "@/lib/learn/highlight";
import { cn } from "@/lib/utils";

/**
 * Renders trusted lesson Markdown with highlighted code. Cached because Shiki
 * reads the clock, which Cache Components only allows inside a cache scope.
 */
export async function LessonMarkdown({ source, className }: { source: string; className?: string }) {
  "use cache";
  cacheLife("max");
  const highlighter = await getHighlighter();
  return (
    <div className={cn("lesson-prose", className)}>
      <Markdown
        rehypePlugins={[
          [rehypeShikiFromHighlighter, highlighter, { themes: codeThemes, defaultColor: "light" }],
        ]}
      >
        {source}
      </Markdown>
    </div>
  );
}
