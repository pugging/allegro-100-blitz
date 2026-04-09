import { z } from "zod";
import type { BlitzResult } from "@/lib/types";

const answerKey = z.enum(["A", "B", "C", "D"]);

export const blitzResultSchema = z.object({
  blitzId: z.number().int().min(1).max(100),
  answers: z.record(z.string(), answerKey),
  correctCount: z.number().int().min(0).max(9),
  totalCount: z.number().int().min(1).max(9),
  completedAt: z.string().min(1),
  durationSeconds: z.number().int().min(0).max(86400).optional(),
});

export const completedBlitzesSchema = z.record(
  z.string().regex(/^\d+$/),
  blitzResultSchema,
);

export function parseCompletedBlitzes(
  raw: unknown,
): Record<number, BlitzResult> | null {
  const parsed = completedBlitzesSchema.safeParse(raw);
  if (!parsed.success) return null;
  const out: Record<number, BlitzResult> = {};
  for (const [k, v] of Object.entries(parsed.data)) {
    out[Number(k)] = v;
  }
  return out;
}
