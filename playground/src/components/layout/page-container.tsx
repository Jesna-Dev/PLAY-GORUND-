import { cn } from "@/lib/utils";

/** Standard page padding. Full-bleed pages like the playground skip it. */
export function PageContainer({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-4 pt-4 pb-10 sm:px-6 lg:px-8 lg:pt-8", className)} {...props} />;
}
