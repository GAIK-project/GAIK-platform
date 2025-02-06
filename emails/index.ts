import { config } from "dotenv";
import { Resend } from "resend";

// Load environment variables
config({ path: ".env.local" });

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set in .env.local");
}

if (!process.env.EMAIL_FROM) {
  throw new Error("EMAIL_FROM is not set in .env.local");
}

// Initialize Resend client
export const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to send emails
export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM as string,
    to: to.toLowerCase(),
    subject,
    react,
  });
}
