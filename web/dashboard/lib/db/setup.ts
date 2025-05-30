import { promises as fs } from "node:fs";
import path from "node:path";
import readline from "node:readline";

function question(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    }),
  );
}

// Validation utility functions
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

async function getValidInput(
  prompt: string,
  validator: (input: string) => boolean,
  errorMessage: string,
): Promise<string> {
  while (true) {
    const input = await question(prompt);
    if (input === "") return input; // Allow empty for skipped steps
    if (validator(input)) {
      return input;
    }
    console.log(`❌ ${errorMessage}`);
  }
}

async function writeEnvFile(content: string) {
  try {
    await fs.writeFile(path.join(process.cwd(), ".env.local"), content);
    console.log("\n✅ Successfully wrote .env.local file!");
  } catch (error) {
    console.error("❌ Error writing .env.local file:", error);
    throw error;
  }
}

// Dummy values for required environment variables
const DUMMY_VALUES = {
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_ANON_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.example-signature",
  DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/postgres",
};

async function simpleSetup() {
  console.log("\n🚀 Setting up basic mode...");

  console.log(
    "\nℹ️  You can optionally add an OpenAI API key for AI functionality",
  );
  console.log(
    "    Skip with Enter if you just want to explore the UI without AI features",
  );

  // Add validation for OpenAI API key
  const openaiKey = await getValidInput(
    "OpenAI API Key (optional): ",
    (key) => key.startsWith("sk-") || key === "",
    'Invalid OpenAI API Key format. Should start with "sk-"',
  );

  // Start with base environment content
  let envContent = "# Basic setup settings\n\n";

  // Add OpenAI key if provided
  if (openaiKey.trim()) {
    envContent += "# OpenAI settings\n";
    envContent += `OPENAI_API_KEY=${openaiKey}\n\n`;
  }

  // Add dummy values for required database and Supabase settings
  envContent += "# Dummy Supabase settings (not real credentials)\n";
  envContent += `NEXT_PUBLIC_SUPABASE_URL=${DUMMY_VALUES.SUPABASE_URL}\n`;
  envContent += `NEXT_PUBLIC_SUPABASE_ANON_KEY=${DUMMY_VALUES.SUPABASE_ANON_KEY}\n`;
  envContent += `DATABASE_URL=${DUMMY_VALUES.DATABASE_URL}\n`;
  envContent +=
    "# Note: These are dummy values to prevent errors. They don't connect to real services.\n\n";

  // Add default email settings for development
  envContent += "# Email settings (minimal defaults for development)\n";
  envContent += `NEXT_PUBLIC_APP_URL=http://localhost:3000\n`;

  await writeEnvFile(envContent);

  console.log("\n✨ Basic mode setup complete!");
  console.log("🔍 You can now run 'npm run dev' to start the application");
  console.log("📝 The application will be available at http://localhost:3000");
  console.log("🤖 Chatbot will be accessible at http://localhost:3000/chatbot");
}

async function fullSetup() {
  console.log("\n🚀 Starting full project setup...");
  console.log("This will configure all settings for your application");

  // Supabase settings
  console.log("\n1️⃣  Supabase Configuration (for authentication)");
  console.log("Visit https://supabase.com to create an account and project");

  // Add validation for Supabase URL
  const supabaseUrl = await getValidInput(
    "Supabase URL (or press Enter for dummy value): ",
    (url) => isValidUrl(url) || url === "",
    "Invalid URL format. URL must start with http:// or https://",
  );

  const supabaseKey = await question(
    "Supabase Anon Key (or press Enter for dummy value): ",
  );

  // Add validation for Database URL
  const databaseUrl = await getValidInput(
    "Database URL (or press Enter for dummy value): ",
    (url) => url.startsWith("postgresql://") || url === "",
    'Invalid Database URL format. Should start with "postgresql://"',
  );

  // S3 settings
  console.log("\n2️⃣  Allas S3 Configuration (for file storage)");

  const s3AccessKey = await question("Allas Access Key ID: ");
  const s3SecretKey = await question("Allas Secret Access Key: ");

  // Add validation for Allas Endpoint URL
  const s3Endpoint = await getValidInput(
    "Allas Endpoint URL: ",
    (url) => isValidUrl(url) || url === "",
    "Invalid URL format. URL must start with http:// or https://",
  );

  const s3Bucket = await question("Allas Bucket Name: ");

  // OpenAI settings
  console.log("\n3️⃣  OpenAI Configuration (for AI functionality)");

  // Add validation for OpenAI API key
  const openaiKey = await getValidInput(
    "OpenAI API Key: ",
    (key) => key.startsWith("sk-") || key === "",
    'Invalid OpenAI API Key format. Should start with "sk-"',
  );

  // Email settings
  console.log("\n4️⃣  Email Configuration (for invitations)");
  console.log("Visit https://resend.com to create an account and get API key");

  // Add validation for Application URL
  const appUrl = await getValidInput(
    "Application URL (press Enter for http://localhost:3000): ",
    (url) => isValidUrl(url) || url === "",
    "Invalid URL format. URL must start with http:// or https://",
  );

  const resendApiKey = await question("Resend API Key: ");
  const emailFrom = await question(
    "Email From address (e.g., noreply@yourdomain.com): ",
  );

  // Build env file content
  let envContent = "";

  // Supabase - use provided values or dummy values if empty
  envContent += "# Supabase settings\n";
  envContent += `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl.trim() || DUMMY_VALUES.SUPABASE_URL}\n`;
  envContent += `NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey.trim() || DUMMY_VALUES.SUPABASE_ANON_KEY}\n`;
  envContent += `DATABASE_URL=${databaseUrl.trim() || DUMMY_VALUES.DATABASE_URL}\n\n`;

  // If using dummy values, add a note
  if (!supabaseUrl.trim() || !supabaseKey.trim() || !databaseUrl.trim()) {
    envContent +=
      "# Note: Some dummy values are used above to prevent errors. They don't connect to real services.\n\n";
  }

  // S3
  if (s3AccessKey || s3SecretKey || s3Endpoint || s3Bucket) {
    envContent += "# Allas S3 settings\n";
    if (s3AccessKey) envContent += `ALLAS_ACCESS_KEY_ID=${s3AccessKey}\n`;
    if (s3SecretKey) envContent += `ALLAS_SECRET_ACCESS_KEY=${s3SecretKey}\n`;
    if (s3Endpoint) envContent += `ALLAS_ENDPOINT_URL=${s3Endpoint}\n`;
    if (s3Bucket) envContent += `ALLAS_BUCKET_NAME=${s3Bucket}\n\n`;
  }

  // OpenAI
  if (openaiKey) {
    envContent += "# OpenAI settings\n";
    envContent += `OPENAI_API_KEY=${openaiKey}\n\n`;
  }

  // Email
  envContent += "# Email settings\n";
  envContent += `NEXT_PUBLIC_APP_URL=${appUrl.trim() || "http://localhost:3000"}\n`;
  if (resendApiKey) envContent += `RESEND_API_KEY=${resendApiKey}\n`;
  if (emailFrom) envContent += `EMAIL_FROM=${emailFrom}\n\n`;

  await writeEnvFile(envContent);

  console.log("\n✨ Full setup complete!");
  console.log("\nNext steps:");

  // Only suggest running migrations if user provided real DB credentials
  if (databaseUrl.trim() && databaseUrl !== DUMMY_VALUES.DATABASE_URL) {
    console.log("1. Run migrations: npm run db:migrate");
    console.log("2. Start the server: npm run dev");
  } else {
    console.log("1. Start the server: npm run dev");
    console.log(
      "Note: Database migrations were skipped as you're using dummy credentials",
    );
  }
}

async function main() {
  console.log("🌟 Application Setup 🌟");
  console.log("\nThis script will help you set up your environment variables.");
  console.log("❗ Warning: This will overwrite any existing .env.local file");

  const setupType = await question(
    "\nChoose setup type:\n1. Basic setup (minimal configuration)\n2. Full setup (all settings)\nEnter choice (1/2): ",
  );

  if (setupType === "1") {
    await simpleSetup();
  } else if (setupType === "2") {
    await fullSetup();
  } else {
    console.log("❌ Invalid choice. Please run the script again.");
    process.exit(1);
  }
}

main().catch(console.error);
