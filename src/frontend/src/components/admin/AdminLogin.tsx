import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useAdminLogin } from "@/lib/backend";
import { errorMessage } from "@/lib/errors";
import { Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";

export function AdminLogin() {
  const { adminLogin } = useAdminAuth();
  const login = useAdminLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { email, password },
      { onSuccess: (result) => adminLogin(result.token, result.name) },
    );
  };

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-card p-6"
      >
        <div className="space-y-1 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
            <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <h1 className="font-display text-xl font-bold">Employee sign in</h1>
          <p className="text-sm text-muted-foreground">
            CropVibe operations console
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-email">Work email</Label>
          <Input
            id="admin-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@cropvibe.in"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-password">Password</Label>
          <Input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {login.isError && (
          <p role="alert" className="text-sm text-destructive">
            {errorMessage(login.error)}
          </p>
        )}
        <Button
          type="submit"
          disabled={login.isPending}
          className="w-full tap-target"
        >
          {login.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          Sign in
        </Button>
      </form>
    </div>
  );
}
