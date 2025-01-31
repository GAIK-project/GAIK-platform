
import { db } from "@/lib/db/drizzle/drizzle";
import { organizationInvites, organizations } from "@/lib/db/drizzle/schema";
// import { sendEmail } from "@/lib/email"; // Implement this
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const organizationName = formData.get("organizationName") as string;
    const adminEmail = formData.get("adminEmail") as string;

    // 1. Create organization
    const [organization] = await db.insert(organizations)
      .values({
        name: organizationName,
        isActive: true,
      })
      .returning();

    // 2. Create invite
    const token = nanoid();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db.insert(organizationInvites).values({
      email: adminEmail,
      organizationId: organization.id,
      role: "COMPANY_ADMIN",
      token,
      expiresAt,
    });

    // 3. Send invitation email
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/signup?token=${token}`;
    // await sendEmail({
    //   to: adminEmail,
    //   subject: `Invitation to join ${organizationName}`,
    //   html: `
    //     <h1>You've been invited!</h1>
    //     <p>Click the link below to set up your account as admin of ${organizationName}:</p>
    //     <a href="${inviteUrl}">Accept Invitation</a>
    //   `,
    // });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, error: "Failed to create organization" },
      { status: 500 }
    );
  }
}