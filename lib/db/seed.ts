// lib/db/seed.ts
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import path from "path";
import { db } from "./drizzle/drizzle";
import { userProfiles } from "./drizzle/schema";

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminUserEmail = process.env.ADMIN_USER_EMAIL;
const adminUserPassword = process.env.ADMIN_USER_PASSWORD;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase credentials in .env.local");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  if (!adminUserEmail || !adminUserPassword) {
    throw new Error("Missing admin credentials in .env.local");
  }
  try {
    // Check if admin already exists
    const { data: existingUser } =
      await supabase.auth.admin.getUserById(adminUserEmail);

    if (existingUser.user) {
      console.log("Admin user already exists");
      return;
    }

    console.log("Starting seed...");

    // Create admin user in Supabase
    const { data: authUser, error: authError } =
      await supabase.auth.admin.createUser({
        email: adminUserEmail,
        password: adminUserPassword,
        email_confirm: true,
        user_metadata: {
          name: "Gaik User",
          organization: "HAAGA_HELIA",
          role: "ADMIN",
        },
      });

    if (authError) {
      throw authError;
    }

    if (!authUser.user) {
      throw new Error("Failed to create auth user");
    }

    console.log("Created Supabase auth user:", authUser.user.email);

    // Create admin user in our database
    await db.insert(userProfiles).values({
      id: authUser.user.id,
      // Esimerkki oletusasetuksista
      preferences: {
        language: "fi",
        notifications: {
          email: true,
        },
      },
      // Voit lisätä avatarin jos haluat
      avatar: "/avatars/default.png",
    });

    console.log("Created admin user in database");
    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Seed failed:", error);
    throw error;
  }
}

// Run the seed
seed()
  .catch((error) => {
    console.error("Failed to seed database:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit();
  });
