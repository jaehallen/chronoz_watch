import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: 'turso',
  schema: './src/lib/schema/schema.ts',
  dbCredentials: {
    url: process.env.DB_URL!,
    authToken: process.env.DB_TOKEN!
  },
  casing: "snake_case",
  strict: true,
  breakpoints: true,
  verbose: true,
})