import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { userData } from "@/db/schema";
import { isSyncedKey } from "@/lib/sync/keys";
import { requireUserId } from "@/lib/sync/server";

/** Everything the signed-in user has saved, as { key: value }. */
export async function GET() {
  const userId = await requireUserId();
  if (userId instanceof Response) return userId;

  const rows = await db.select({ key: userData.key, value: userData.value }).from(userData).where(eq(userData.userId, userId));
  return Response.json({ data: Object.fromEntries(rows.map((r) => [r.key, r.value])) }, { headers: { "Cache-Control": "no-store" } });
}

/** Delete some saved stores: DELETE /api/data?key=tutor:v1&key=learn:v1 */
export async function DELETE(request: Request) {
  const userId = await requireUserId();
  if (userId instanceof Response) return userId;

  const keys = new URL(request.url).searchParams.getAll("key");
  if (keys.length === 0 || !keys.every(isSyncedKey)) {
    return Response.json({ error: "Name the data to delete with one or more valid key parameters." }, { status: 400 });
  }
  await db.delete(userData).where(and(eq(userData.userId, userId), inArray(userData.key, keys)));
  return new Response(null, { status: 204 });
}
