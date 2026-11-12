import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

// One connection pool per server process. Development reloads modules, so keep it on globalThis.
const globalForDb = globalThis as unknown as { pg?: ReturnType<typeof postgres> };
// postgres() doesn't connect until the first query, so a missing URL only fails when data is used.
const client = globalForDb.pg ?? postgres(process.env.DATABASE_URL ?? "postgres://not-configured", { max: 10 });
if (process.env.NODE_ENV !== "production") globalForDb.pg = client;

export const db = drizzle(client, { schema });
