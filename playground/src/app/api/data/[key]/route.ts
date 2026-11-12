import { sql } from "drizzle-orm";
import { db } from "@/db";
import { userData } from "@/db/schema";
import { MAX_VALUE_BYTES, isSyncedKey } from "@/lib/sync/keys";
import { requireUserId } from "@/lib/sync/server";

/** Save one store for the signed-in user. The body is the store's JSON value. */
export async function PUT(request: Request, ctx: RouteContext<"/api/data/[key]">) {
  const userId = await requireUserId();
  if (userId instanceof Response) return userId;

  const { key } = await ctx.params;
  if (!isSyncedKey(key)) return Response.json({ error: `"${key}" isn't something that can be saved.` }, { status: 404 });

  const body = await request.text();
  if (body.length > MAX_VALUE_BYTES) {
    return Response.json({ error: "That's too much to save in one go. Remove some files or messages and try again." }, { status: 413 });
  }
  let value: unknown;
  try {
    value = JSON.parse(body);
  } catch {
    return Response.json({ error: "The data to save must be JSON." }, { status: 400 });
  }
  if (value === null || typeof value !== "object") {
    return Response.json({ error: "The data to save must be a JSON object or array." }, { status: 400 });
  }

  await db
    .insert(userData)
    .values({ userId, key, value })
    .onConflictDoUpdate({ target: [userData.userId, userData.key], set: { value, updatedAt: sql`now()` } });
  return new Response(null, { status: 204 });
}
