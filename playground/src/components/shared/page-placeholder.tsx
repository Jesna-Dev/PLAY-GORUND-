import { ArrowLeft, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/shared/button-link";

export function PagePlaceholder({
  title,
  description,
  phase,
  planned,
}: {
  title: string;
  description: string;
  phase: number;
  planned: string[];
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
      <Badge variant="secondary">Coming in Phase {phase}</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-pretty text-muted-foreground">{description}</p>
      <ul className="mt-6 space-y-2.5 text-sm">
        {planned.map((item) => (
          <li key={item} className="flex gap-2.5">
            <Check
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
            />
            {item}
          </li>
        ))}
      </ul>
      <ButtonLink variant="outline" className="mt-8" href="/dashboard">
        <ArrowLeft aria-hidden="true" />
        Back to dashboard
      </ButtonLink>
    </div>
  );
}
