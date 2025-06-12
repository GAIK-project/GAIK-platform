"use client";

import { registerUser } from "@/app/actions/auth/register-user";
import { PasswordInput } from "@/components/password-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Particles } from "@/components/ui/particles";
import Shapes from "@/public/shapes.svg";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const fadeInUp = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating account...
        </>
      ) : (
        "Sign up"
      )}
    </Button>
  );
}

export default function SignupForm({
  inviteEmail,
  token,
}: {
  inviteEmail: string;
  token: string;
}) {
  const [state, formAction] = useActionState(registerUser, {
    errors: {},
    message: "",
  });

  return (
    <div className="relative overflow-hidden h-screen w-screen bg-fade-diagonal dark:bg-zinc-900">
      <Image
        src={Shapes || "/placeholder.svg"}
        alt="shapes"
        className="absolute -top-8 -left-8 z-0 opacity-30"
        width={160}
        height={160}
        priority
        unoptimized
      />
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        className="flex flex-col h-full w-full items-center justify-center"
      >
        <Particles
          className="absolute inset-0"
          color="#666666"
          quantity={190}
          staticity={110}
          ease={30}
          size={0.42}
          refresh={false}
          vy={0.1}
        />
        <Card className="w-full max-w-md relative">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Create an account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your details to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state?.message && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}

            <form action={formAction} className="space-y-6">
              <input type="hidden" name="token" value={token || ""} />
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    autoComplete="name"
                    required
                  />
                  {state?.errors?.name && (
                    <p className="text-destructive text-sm">
                      {state.errors.name.join(", ")}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={inviteEmail || ""}
                    readOnly
                    className="bg-gray-100"
                    autoComplete="username"
                  />
                  {state?.errors?.email && (
                    <p className="text-destructive text-sm">
                      {state.errors.email.join(", ")}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <PasswordInput
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                  />
                  {state?.errors?.password && (
                    <p className="text-destructive text-sm">
                      {state.errors.password.join(", ")}
                    </p>
                  )}
                </div>

                <SubmitButton />
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
