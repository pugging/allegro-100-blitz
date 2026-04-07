"use client";

import { Button } from "@/components/ui/button";
import type { Difficulty, RoleTag } from "@/lib/types";

type FilterStatus = "all" | "not_started" | "completed";

interface FilterBarProps {
  difficulty: Difficulty | "all";
  role: RoleTag | "all";
  status: FilterStatus;
  onDifficultyChange: (v: Difficulty | "all") => void;
  onRoleChange: (v: RoleTag | "all") => void;
  onStatusChange: (v: FilterStatus) => void;
}

const difficulties: { value: Difficulty | "all"; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const roles: { value: RoleTag | "all"; label: string }[] = [
  { value: "all", label: "Все роли" },
  { value: "automation", label: "Automation" },
  { value: "controller", label: "Controller" },
  { value: "project", label: "Project" },
  { value: "general", label: "General" },
];

const statuses: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "not_started", label: "Не начато" },
  { value: "completed", label: "Пройдено" },
];

function Chips<T extends string>({
  items,
  value,
  onChange,
}: {
  items: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <Button
          key={item.value}
          variant={value === item.value ? "default" : "outline"}
          size="sm"
          className="h-7 text-xs"
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}

export function FilterBar({
  difficulty,
  role,
  status,
  onDifficultyChange,
  onRoleChange,
  onStatusChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Сложность
        </span>
        <Chips items={difficulties} value={difficulty} onChange={onDifficultyChange} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Роль
        </span>
        <Chips items={roles} value={role} onChange={onRoleChange} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Статус
        </span>
        <Chips items={statuses} value={status} onChange={onStatusChange} />
      </div>
    </div>
  );
}
