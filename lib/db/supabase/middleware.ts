import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Check for a guest mode cookie
  const guestMode = request.cookies.get("guest-mode")?.value === "true";

  // Check if the request is for an API route
  const isApiRoute = request.nextUrl.pathname.startsWith("/api/");

  // Block API access for guest mode users
  if (guestMode && isApiRoute) {
    // Option 1: Return a 403 Forbidden response
    return NextResponse.json(
      { error: "API access not allowed in guest mode" },
      { status: 403 }
    );
  }

  // If guest mode is active but not accessing API, skip authentication
  if (guestMode) {
    return NextResponse.next({ request });
  }

  // Rest of your existing middleware code
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define public routes
  const publicRoutes = ["/sign-in"];
  const isPublicRoute = publicRoutes.some(
    (route) =>
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith(`${route}/`)
  );

  // If user is not logged in, redirect to sign-in page
  if (!isPublicRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // Check admin role
  if (user && request.nextUrl.pathname.startsWith("/admin")) {
    const userRole = user.user_metadata.role;

    if (userRole !== "ADMIN") {
      const url = request.nextUrl.clone();
      url.pathname = "/"; // Not an admin, redirect to home page
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
