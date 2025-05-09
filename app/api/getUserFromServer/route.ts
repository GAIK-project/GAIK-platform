import { NextRequest, NextResponse } from 'next/server';
import { getUserData } from '@/lib/db/drizzle/queries';

export async function GET(request: NextRequest) {
  const user = await getUserData();
    console.log(user);
  if (!user?.email) {
    return NextResponse.json({ error: 'Email not found' }, { status: 500 });
  }

  return NextResponse.json({ email: user.email });
}