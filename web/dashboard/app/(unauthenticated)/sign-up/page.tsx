// app/sign-up/page.tsx (Server Component)
import LoadingSpinner from "@/app/loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getInviteByToken } from "@/lib/db/drizzle/queries";
import { XCircle } from "lucide-react";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import SignupForm from "./signup-form";

interface SignupPageProps {
  token?: string | null;
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<SignupPageProps>;
}) {
  const params = await searchParams;
  const token = params.token;
  console.log("token:", token);

  if (!token) return <InvalidTokenMessage />;

  const invite = await getInviteByToken(token);
  if (!invite) return <InvalidTokenMessage />;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SignupForm inviteEmail={invite.email} token={token} />
    </Suspense>
  );
}

async function redirectToHome() {
  "use server";
  redirect("/");
}

function InvalidTokenMessage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Error Icon */}
        <div className="flex justify-center">
          <XCircle className="h-24 w-24 text-red-500" />
        </div>

        {/* Alert Component */}
        <Alert variant="destructive" className="border-red-500">
          <AlertTitle className="text-lg font-semibold mb-2">
            Invalid Invitation
          </AlertTitle>
          <AlertDescription className="text-sm">
            The invitation link you&apos;re trying to use is either invalid or
            has expired. Please contact your administrator for a valid
            invitation link.
          </AlertDescription>
        </Alert>

        {/* Additional Help Text */}
        <div className="text-gray-600 text-sm mt-4 text-start">
          <p>If you believe this is a mistake, you can:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Check if you copied the entire invitation link</li>
            <li>Request a new invitation from your administrator</li>
            <li>Contact support for assistance</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          <form action={redirectToHome}>
            <Button
              type="submit"
              variant="destructive"
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              Return to Home
            </Button>
          </form>
        </div>
      </div>

      {/* Support Contact */}
      <div className="mt-8 text-sm text-gray-500">
        Need help? Contact support at{" "}
        <a
          href="mailto:support@example.com"
          className="text-red-500 hover:text-red-600"
        >
          support@example.com
        </a>
      </div>
    </div>
  );
}
