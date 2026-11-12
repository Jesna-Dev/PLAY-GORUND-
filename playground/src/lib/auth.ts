import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { ACCOUNT_TYPES, isAccountType } from "@/lib/account-types";

/** A Standard Schema check, so the server refuses any account type outside the list. */
const accountTypeInput = {
  "~standard": {
    version: 1 as const,
    vendor: "codly",
    validate: (value: unknown) =>
      isAccountType(value) ? { value } : { issues: [{ message: "Choose Student, Employer or Candidate." }] },
  },
};

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  user: {
    additionalFields: {
      accountType: {
        type: [...ACCOUNT_TYPES],
        required: false,
        defaultValue: "student",
        input: true,
        validator: { input: accountTypeInput },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh the expiry once a day
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
