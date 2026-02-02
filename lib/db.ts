import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL no está definida en las variables de entorno");
}

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);

export const db = drizzle(client, { schema });
