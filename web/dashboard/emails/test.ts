import { config } from "dotenv";
import path from "path";
import { Resend } from "resend";
import { InviteEmail } from "./invite-email";

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), ".env.local") });

console.log("Starting email test...");
console.log("Current working directory:", process.cwd());
console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "akuleskinen@hotmail.com",
      subject: "Test Invite Email",
      react: await InviteEmail({
        organizationName: "Test Organization",
        inviteUrl: "http://localhost:3000/signup?token=test-123",
      }),
    });

    console.log("Email sent successfully:", data);
  } catch (error) {
    console.error("Failed to send test email:", error);
  }
}

testEmail();
