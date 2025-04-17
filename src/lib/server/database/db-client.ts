import { drizzle } from 'drizzle-orm/libsql/web';
import { env } from "$env/dynamic/private";
import { createClient } from "@libsql/client/web";
import * as schema from "$lib/schema/schema"
import * as schemaRelation from "$lib/schema/relations"


const turso = createClient({
  url: env.DB_URL,
  authToken: env.DB_TOKEN
});


export const db = drizzle(turso, {
  schema: { ...schema, ...schemaRelation },
  casing: 'snake_case',
  logger: true
});