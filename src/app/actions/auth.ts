"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const credentialsSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(8, "Пароль не короче 8 символов"),
});

export async function signInAction(
  _prev: unknown,
  formData: FormData,
): Promise<{ error?: string }> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ошибка валидации" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { error: "Supabase не настроен (проверьте переменные окружения)" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUpAction(
  _prev: unknown,
  formData: FormData,
): Promise<{
  error?: string;
  ok?: true;
  needsEmailConfirmation?: true;
  hint?: string;
}> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ошибка валидации" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { error: "Supabase не настроен (проверьте переменные окружения)" };
  }

  const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    const msg = error.message;
    let hint: string | undefined;
    if (/already registered|already been registered|User already exists/i.test(msg)) {
      hint =
        "Этот email уже зарегистрирован — войдите на странице «Вход» или сбросьте пароль в Supabase / через «Forgot password», если доступно.";
    } else if (/password/i.test(msg) && /short|least|characters/i.test(msg)) {
      hint =
        "В Supabase Authentication → Providers → Email можно задать минимальную длину пароля; она должна быть не больше того, что вы вводите (у нас минимум 8 символов).";
    } else if (/rate limit|too many/i.test(msg)) {
      hint = "Подождите несколько минут и попробуйте снова.";
    } else if (/invalid|api key|jwt/i.test(msg)) {
      hint =
        "Проверьте NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в .env.local (или Vercel) — без пробелов и переносов.";
    }
    return { error: msg, hint };
  }

  revalidatePath("/", "layout");

  // При включённом «Confirm email» сессия не выдаётся до клика по ссылке в письме
  if (data.user && !data.session) {
    return {
      ok: true as const,
      needsEmailConfirmation: true as const,
      hint:
        "Откройте письмо от Supabase (и папку «Спам»). Пока email не подтверждён, вход по паролю может не сработать.",
    };
  }

  return { ok: true as const };
}

export async function signOutAction(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/auth/login");
}
