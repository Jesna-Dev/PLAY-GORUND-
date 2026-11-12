import "server-only";
import { headers } from "next/headers";
import { isDatabaseConfigured } from "@/db";
import { auth } from "@/lib/auth";

/** The signed-in user's id, or a Response to return when there isn't one. */
export async function requireUserId(): Promise<string | Response> {
  if (!isDatabaseConfigured) {
    return Response.json({ error: "The database isn't set up. Add DATABASE_URL to .env.local." }, { status: 503 });
  }
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json({ error: "Sign in to save your data." }, { status: 401 });
  return session.user.id;
}
