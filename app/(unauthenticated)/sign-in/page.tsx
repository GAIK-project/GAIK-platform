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
        <h1 className="text-4xl font-light mb-8 relative z-10 tracking-wide text-gray-800 dark:text-gray-100">
          GAIK
        </h1>
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
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
