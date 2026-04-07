import { Badge } from "@/components/ui/badge";
import type { RoleTag } from "@/lib/types";

const config: Record<RoleTag, { label: string; className: string }> = {
  automation: {
    label: "Automation",
    className:
      "border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100/80",
  },
  controller: {
    label: "Controller",
    className:
      "border-sky-200 bg-sky-50 text-sky-900 hover:bg-sky-100/80",
  },
  project: {
    label: "Project",
    className:
      "border-orange-200 bg-orange-50 text-orange-900 hover:bg-orange-100/80",
  },
  general: {
    label: "General",
    className:
      "border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100/80",
  },
};

export function RoleBadge({ role }: { role: RoleTag }) {
  const c = config[role];
  return (
    <Badge variant="outline" className={c.className}>
      {c.label}
    </Badge>
  );
}
