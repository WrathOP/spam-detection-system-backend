import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { schema } from "./schemas";

export const database = drizzle(sql, { schema });
