"use client";

import { BriefcaseBusiness, GraduationCap, UserSearch } from "lucide-react";
import { ACCOUNT_TYPES, ACCOUNT_TYPE_INFO, type AccountType } from "@/lib/account-types";
import { cn } from "@/lib/utils";

export const ACCOUNT_TYPE_ICONS: Record<AccountType, typeof GraduationCap> = {
  student: GraduationCap,
  candidate: UserSearch,
  employer: BriefcaseBusiness,
};

/** Three radio cards. Real radio inputs, so arrow keys and forms work as expected. */
export function AccountTypePicker({
  name = "accountType",
  value,
  onChange,
  legend = "I'm joining as",
  compact = false,
}: {
  name?: string;
  value: AccountType;
  onChange: (value: AccountType) => void;
  legend?: string;
  compact?: boolean;
}) {
  return (
    <fieldset>
      <legend className={cn("text-sm font-medium", compact && "sr-only")}>{legend}</legend>
      <div className={cn("grid gap-2", !compact && "mt-1.5", compact && "sm:grid-cols-3")}>
        {ACCOUNT_TYPES.map((type) => {
          const Icon = ACCOUNT_TYPE_ICONS[type];
          const { label, description } = ACCOUNT_TYPE_INFO[type];
          const selected = value === type;
          return (
            <label
              key={type}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl p-3 ring-1 transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                selected ? "bg-primary/10 ring-primary" : "bg-background/60 ring-foreground/15 hover:bg-accent",
              )}
            >
              <input
                type="radio"
                name={name}
                value={type}
                checked={selected}
                onChange={() => onChange(type)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg",
                  selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">{label}</span>
                {!compact && <span className="block text-xs text-muted-foreground">{description}</span>}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
