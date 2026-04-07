import { Badge } from "@/components/ui/badge";
import type { Difficulty } from "@/lib/types";

const config: Record<Difficulty, { label: string; className: string }> = {
  easy: {
    label: "Easy",
    className:
      "border-[color:var(--success)]/30 bg-[color:var(--success)]/10 text-[color:var(--success)] hover:bg-[color:var(--success)]/15",
  },
  medium: {
    label: "Medium",
    className:
      "border-[color:var(--warning)]/35 bg-[color:var(--warning)]/10 text-[color:var(--warning)] hover:bg-[color:var(--warning)]/15",
  },
  hard: {
    label: "Hard",
    className:
      "border-[color:var(--danger)]/35 bg-[color:var(--danger)]/10 text-[color:var(--danger)] hover:bg-[color:var(--danger)]/15",
  },
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const c = config[difficulty];
  return (
    <Badge variant="outline" className={c.className}>
      {c.label}
    </Badge>
  );
}
