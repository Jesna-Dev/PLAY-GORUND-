import { defineConfig } from "drizzle-kit";

// drizzle-kit doesn't read .env.local itself; the npm scripts load it with Node's --env-file.
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
