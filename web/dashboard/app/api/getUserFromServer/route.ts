import { getUserData } from "@/lib/db/drizzle/queries";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUserData();
  console.log(user);
  if (!user?.email) {
    return NextResponse.json({ error: "Email not found" }, { status: 500 });
  }

  return NextResponse.json({ email: user.email });
}
