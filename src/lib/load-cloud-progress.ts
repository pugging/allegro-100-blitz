import { parseCompletedBlitzes } from "@/lib/schemas/progress";
import { recomputeProgressFromBlitzes } from "@/lib/recompute-progress";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { UserProgress } from "@/lib/types";

export async function loadCloudProgressForUser(): Promise<{
  user: { email?: string } | null;
  progress: UserProgress | null;
}> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { user: null, progress: null };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { user: null, progress: null };
  }

  const { data, error } = await supabase
    .from("user_learning_progress")
    .select("completed_blitzes")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return {
      user: { email: user.email },
      progress: recomputeProgressFromBlitzes({}),
    };
  }

  const parsed =
    parseCompletedBlitzes(data?.completed_blitzes ?? {}) ?? {};
  const progress = recomputeProgressFromBlitzes(parsed);

  return {
    user: { email: user.email },
    progress,
  };
}
