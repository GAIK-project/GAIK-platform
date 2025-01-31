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

async function shouldSetupStep(stepName: string): Promise<boolean> {
  const answer = await question(`Do you want to setup ${stepName}? (y/N): `);
  return answer.toLowerCase() === "y";
}

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

async function getSupabaseCredentials() {
  console.log("\nStep 1: Setting up Supabase credentials");

  if (!(await shouldSetupStep("Supabase"))) {
    return {
      supabaseUrl: "",
      supabaseAnonKey: "",
      databaseUrl: "",
    };
  }

  console.log("Please visit: https://supabase.com/dashboard");
  console.log("Create a new project or select an existing one");
  console.log(
    "Go to Project Home Screen -> Click 'Connect' and Select App Frameworks tab to find your credentials\n",
  );

  const supabaseUrl = await getValidInput(
    "Enter your Supabase URL: ",
    (url) => isValidUrl(url),
    "Invalid URL format. URL must start with http:// or https://",
  );

  const supabaseAnonKey = await question("Enter your Supabase Anon Key: ");

  const databaseUrl = await getValidInput(
    "Enter your Database URL (for Drizzle): ",
    (url) => url.startsWith("postgresql://"),
    'Invalid Database URL format. Should start with "postgresql://"',
  );

  return { supabaseUrl, supabaseAnonKey, databaseUrl };
}

async function getCSCCredentials() {
  console.log("\nStep 2: Setting up CSC Allas (S3) credentials");

  if (!(await shouldSetupStep("CSC Allas (S3)"))) {
    return {
      accessKeyId: "",
      secretAccessKey: "",
      endpointUrl: "",
      bucketName: "",
    };
  }

  console.log("Please visit:");
  console.log("- https://docs.csc.fi/cloud/pouta/");
  console.log(
    "- https://docs.csc.fi/support/faq/how-to-get-Allas-s3-credentials/\n",
  );

  const accessKeyId = await question("Enter your Allas Access Key ID: ");
  const secretAccessKey = await question(
    "Enter your Allas Secret Access Key: ",
  );
  const endpointUrl = await getValidInput(
    "Enter your Allas Endpoint URL: ",
    (url) => isValidUrl(url),
    "Invalid URL format. URL must start with http:// or https://",
  );
  const bucketName = await question("Enter your Allas Bucket Name: ");

  return { accessKeyId, secretAccessKey, endpointUrl, bucketName };
}

async function getOpenAIKey() {
  console.log("\nStep 3: Setting up OpenAI API");

  if (!(await shouldSetupStep("OpenAI API"))) {
    return "";
  }

  console.log(
    "Please visit: https://platform.openai.com/api-keys to get your API key\n",
  );

  return await getValidInput(
    "Enter your OpenAI API Key: ",
    (key) => key.startsWith("sk-"),
    'Invalid OpenAI API Key format. Should start with "sk-"',
  );
}

async function writeEnvFile(envVars: Record<string, string>) {
  console.log("\nWriting environment variables to .env.local file...");

  // Filter out empty values
  const filteredEnvVars = Object.fromEntries(
    Object.entries(envVars).filter(([_, value]) => value !== ""),
  );

  const envContent = Object.entries(filteredEnvVars)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  await fs.writeFile(path.join(process.cwd(), ".env.local"), envContent);
}

async function main() {
  console.log("🚀 Starting project setup...\n");
  console.log(
    "For each step, you can choose to skip if you don't need it now.\n",
  );
  console.log(
    "❗ Warning running this script will overwrite your existing .env.local file ❗\n",
  );

  try {
    // Get all credentials
    const supabase = await getSupabaseCredentials();
    const csc = await getCSCCredentials();
    const openaiKey = await getOpenAIKey();

    // Combine all environment variables
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: supabase.supabaseUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabase.supabaseAnonKey,
      DATABASE_URL: supabase.databaseUrl + `\n\n#Allas S3 credentials`,
      ALLAS_ACCESS_KEY_ID: csc.accessKeyId,
      ALLAS_SECRET_ACCESS_KEY: csc.secretAccessKey,
      ALLAS_ENDPOINT_URL: csc.endpointUrl,
      ALLAS_BUCKET_NAME: csc.bucketName + `\n\n#AI API credentials`,
      OPENAI_API_KEY: openaiKey,
    };

    // Write to .env.local file
    await writeEnvFile(envVars);

    console.log("\n✅ Setup completed successfully!");
    console.log("Created .env.local file with your configuration.");
    console.log("\nNEXT STEPS:");
    console.log(
      '1. Run your database migrations (if using Supabase/Drizzle) "pnpm db:push" OR "pnpm db:migrate"',
    );
    console.log('2. Start your development server with "pnpm dev"');
  } catch (error) {
    console.error("❌ An error occurred during setup:", error);
    process.exit(1);
  }
}

main().catch(console.error);
