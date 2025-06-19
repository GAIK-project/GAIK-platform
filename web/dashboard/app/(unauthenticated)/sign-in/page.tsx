"use client";

import { enableGuestMode } from "@/app/actions/auth/guest-mode";
import { loginUser } from "@/app/actions/auth/login-user";
import { PasswordInput } from "@/components/password-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Particles } from "@/components/ui/particles";
import Shapes from "@/public/shapes.svg";
import { Separator } from "@radix-ui/react-separator";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";

const fadeInUp = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

function GuestButton() {
  return (
    <form action={enableGuestMode}>
      <Button type="submit" variant="outline" className="w-full">
        Continue as Guest
      </Button>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Sign in"
      )}
    </Button>
  );
}

function GithubLink() {
  return (
    <Link
      href="https://github.com/GAIK-project/GAIK-dashboard"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
    >
      <svg
        className="h-3.5 w-3.5"
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <title>GitHub</title>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
      <span>View source on GitHub</span>
    </Link>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginUser, {
    errors: {},
    message: "",
  });

  return (
    <div className="relative overflow-hidden h-screen w-screen bg-linear-to-br from-transparent via-secondary to-secondary dark:from-transparent dark:via-zinc-900 dark:to-zinc-900">
      <Image
        src={Shapes}
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
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
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
        <Image
          src="/logos/SVG/gaik_logo_big_fitted.svg"
          alt="GAIK Logo"
          width={400}
          height={110}
          priority
          className="mb-8 relative z-10 w-auto h-32"
        />
        <Card className="w-full max-w-md relative ">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="my-2">
            {state?.message && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}

            <form action={formAction} className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    autoCapitalize="none"
                    required
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
                    autoComplete="current-password"
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
          </CardContent>
          <CardFooter className="flex flex-col">
            <Separator className="my-4" />
            <GuestButton />
            <p className="text-xs text-center text-muted-foreground mt-4">
              Guest mode provides access without authentication
            </p>
            <div className="mt-4">
              <GithubLink />
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
