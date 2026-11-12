/** What someone is on Codly for. Chosen at sign-up and changeable in Settings. */
export const ACCOUNT_TYPES = ["student", "employer", "candidate"] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const ACCOUNT_TYPE_INFO: Record<AccountType, { label: string; description: string }> = {
  student: { label: "Student", description: "Learning to code with lessons and challenges" },
  candidate: { label: "Candidate", description: "Preparing for coding interviews and job applications" },
  employer: { label: "Employer", description: "Hiring developers and assessing their skills" },
};

export function isAccountType(value: unknown): value is AccountType {
  return typeof value === "string" && (ACCOUNT_TYPES as readonly string[]).includes(value);
}
