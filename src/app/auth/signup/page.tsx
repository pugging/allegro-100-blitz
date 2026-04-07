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

type SignUpState = {
  error?: string;
  hint?: string;
  ok?: true;
  needsEmailConfirmation?: true;
};

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
            <div
              className="mb-4 space-y-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              <p className="font-medium">{state.error}</p>
              {state.hint && (
                <p className="text-xs leading-relaxed text-foreground/90">
                  {state.hint}
                </p>
              )}
            </div>
          )}
          {state.ok && (
            <div
              className="mb-4 space-y-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-950"
              role="status"
            >
              <p>
                {state.needsEmailConfirmation
                  ? "Регистрация принята. Нужно подтвердить email."
                  : "Аккаунт создан — можно входить."}
              </p>
              {state.needsEmailConfirmation && (
                <p className="text-xs leading-relaxed">
                  Проверьте почту и папку «Спам». После перехода по ссылке откройте{" "}
                  <Link
                    href="/auth/login"
                    className="font-medium text-primary underline"
                  >
                    Вход
                  </Link>
                  . В Supabase можно временно отключить подтверждение: Authentication →
                  Providers → Email → выключить «Confirm email».
                </p>
              )}
              {!state.needsEmailConfirmation && (
                <p className="text-xs">
                  <Link
                    href="/auth/login"
                    className="font-medium text-primary underline"
                  >
                    Перейти ко входу
                  </Link>
                </p>
              )}
              {state.hint && (
                <p className="text-xs leading-relaxed opacity-90">{state.hint}</p>
              )}
            </div>
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
