"use client";

import { createInvite } from "@/app/actions/auth/create-invite";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActionState } from "react";

const ORGANIZATION_NAMES = {
  HAAGA_HELIA: "Haaga-Helia",
  GAIK_COMPANIES: "GAIK Companies",
};

export default function InvitePage() {
  const [state, formAction, pending] = useActionState(createInvite, {
    errors: {},
    message: "",
    success: false,
  });

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Send Invitation</CardTitle>
        </CardHeader>
        <CardContent>
          {state?.message && (
            <Alert
              variant={state.success ? "default" : "destructive"}
              className="mb-6"
            >
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email address</label>
              <Input
                name="email"
                type="email"
                placeholder="e.g., user@example.com"
                required
              />
              {state?.errors?.email && (
                <p className="text-destructive text-sm mt-1">
                  {state.errors.email.join(", ")}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Organization</label>
              <Select name="organization" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ORGANIZATION_NAMES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.errors?.organization && (
                <p className="text-destructive text-sm mt-1">
                  {state.errors.organization.join(", ")}
                </p>
              )}
            </div>

            <Button type="submit" disabled={pending}>
              {pending ? "Sending..." : "Send Invitation"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
