"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { parseCompletedBlitzes } from "@/lib/schemas/progress";
import { recomputeProgressFromBlitzes } from "@/lib/recompute-progress";
import type { UserProgress } from "@/lib/types";

export async function fetchCloudProgress(): Promise<UserProgress | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_learning_progress")
    .select("completed_blitzes")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return null;

  const raw = data?.completed_blitzes ?? {};
  const parsed = parseCompletedBlitzes(raw) ?? {};

  return recomputeProgressFromBlitzes(parsed);
}

export async function saveCloudProgress(progress: UserProgress): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "Supabase не настроен" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Не авторизован" };
  }

  const normalized = JSON.parse(
    JSON.stringify(progress.completedBlitzes),
  ) as Record<string, unknown>;
  const completed = parseCompletedBlitzes(normalized);
  if (!completed) {
    return { ok: false, error: "Некорректные данные" };
  }

  const json: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(completed)) {
    json[String(k)] = v;
  }

  const { error } = await supabase.from("user_learning_progress").upsert(
    {
      user_id: user.id,
      completed_blitzes: json,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function resetCloudProgress(): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "Supabase не настроен" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Не авторизован" };
  }

  const { error } = await supabase.from("user_learning_progress").upsert(
    {
      user_id: user.id,
      completed_blitzes: {},
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
