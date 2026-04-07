"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction } from "@/app/actions/auth";
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

type SignUpState = { error?: string; ok?: true };

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signUpAction, {} as SignUpState);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md items-center px-4 py-12">
      <Card className="w-full border-border/80 shadow-md shadow-black/5">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Регистрация
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Минимум 8 символов в пароле. После регистрации проверьте почту, если
            включено подтверждение email в Supabase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSupabaseConfigured() && (
            <p className="mb-4 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm">
              Настройте переменные Supabase в{" "}
              <span className="font-mono">.env.local</span>.
            </p>
          )}
          {state.error && (
            <p
              className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              {state.error}
            </p>
          )}
          {state.ok && (
            <p
              className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-950"
              role="status"
            >
              Аккаунт создан. Если в Supabase включено подтверждение email —
              перейдите по ссылке из письма, затем{" "}
              <Link href="/auth/login" className="font-medium text-primary underline">
                войдите
              </Link>
              .
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
                autoComplete="new-password"
                required
                minLength={8}
                className="h-10"
              />
            </div>
            <Button type="submit" className="h-10 w-full" disabled={pending}>
              {pending ? "Создание…" : "Создать аккаунт"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Войти
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
