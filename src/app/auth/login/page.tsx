"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signInAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isSupabaseConfigured } from "@/lib/supabase/browser";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const [state, formAction, pending] = useActionState(signInAction, {});

  const configured = isSupabaseConfigured();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md items-center px-4 py-12">
      <Card className="w-full border-border/80 shadow-md shadow-black/5">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Вход
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Email и пароль — прогресс синхронизируется в облаке
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!configured && (
            <p className="mb-4 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-foreground">
              Добавьте <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
              и <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> в{" "}
              <span className="font-mono">.env.local</span>.
            </p>
          )}
          {(state.error || urlError) && (
            <p
              className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              {state.error ??
                (urlError === "missing_code"
                  ? "Отсутствует код подтверждения"
                  : decodeURIComponent(urlError ?? ""))}
            </p>
          )}
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                className="h-10"
              />
            </div>
            <Button type="submit" className="h-10 w-full" disabled={pending}>
              {pending ? "Вход…" : "Войти"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Нет аккаунта?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Регистрация
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
