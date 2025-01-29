import { Pool } from "@neondatabase/serverless";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";

dotenv.config({ path: ".env.local" });

const runMigrations = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  const db = drizzle(pool);

  console.log("⏳ Running migration...");

  await migrate(db, {
    migrationsFolder: "./lib/db/drizzle/migration",
  });

  console.log("✅ Migrations completed!");
  await pool.end();
};

runMigrations()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Migration failed!", error);
    process.exit(1);
  });
