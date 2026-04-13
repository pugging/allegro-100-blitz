import Link from "next/link";
import type { Metadata } from "next";
import {
  ClipboardList,
  LineChart,
  Network,
  Package,
  Scale,
} from "lucide-react";
import {
  PE_BLOCK_LABELS,
  PE_TASK_IDS,
  PE_TASK_META,
  type PeTaskId,
} from "@/lib/process-excellence/registry";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Process Excellence — финальный тест",
  description:
    "9 заданий для Junior Project Specialist (Process Excellence), Allegro e-Xperience",
};

const BLOCK_ICONS = {
  A: LineChart,
  B: Network,
  C: Package,
  D: Scale,
} as const;

export default function ProcessExcellenceHubPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-10 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow-sm ring-1 ring-[color:var(--secondary-brand)]/35">
            PE
          </span>
          <Badge variant="outline">Локальная тренировка</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Process Excellence — финальный тест
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Девять заданий в стиле data reasoning: определяй проблему, опирайся на
          данные, рассуждай и формулируй выводы для стейкхолдеров. Прогресс
          заметок хранится только в браузере.
        </p>
        <p className="text-sm text-muted-foreground">
          <Link
            href="/"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            ← К блиц-наборам
          </Link>
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(Object.keys(PE_BLOCK_LABELS) as (keyof typeof PE_BLOCK_LABELS)[]).map(
          (key) => {
            const b = PE_BLOCK_LABELS[key];
            const Icon = BLOCK_ICONS[key];
            return (
              <Card
                key={key}
                className="border-border/70 bg-card/80 shadow-sm"
              >
                <CardHeader className="pb-3">
                  <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" aria-hidden />
                  </div>
                  <CardTitle className="text-sm">{b.title}</CardTitle>
                  <CardDescription className="text-xs leading-snug">
                    {b.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          },
        )}
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <ClipboardList className="size-4 shrink-0" aria-hidden />
        Задания: {PE_TASK_IDS.length}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PE_TASK_IDS.map((id) => (
          <TaskHubCard key={id} id={id} />
        ))}
      </div>
    </div>
  );
}

function TaskHubCard({ id }: { id: PeTaskId }) {
  const meta = PE_TASK_META[id];
  const block = PE_BLOCK_LABELS[meta.block];
  return (
    <Link href={`/process-excellence/${id}`}>
      <Card className="group h-full cursor-pointer overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              #{id}
            </span>
            <Badge variant="secondary" className="text-[10px]">
              ~{meta.estimatedMin} мин
            </Badge>
          </div>
          <CardTitle className="mt-1 text-base leading-snug transition-colors group-hover:text-primary">
            {meta.title}
          </CardTitle>
          <CardDescription className="mt-2 flex flex-wrap gap-1.5">
            <Badge variant="outline" className="font-normal">
              {block.title}
            </Badge>
            <span className="text-xs text-muted-foreground">{meta.short}</span>
          </CardDescription>
          <span
            className={cn(
              buttonVariants({ variant: "ghost", size: "xs" }),
              "mt-3 w-fit px-0 text-primary hover:bg-transparent hover:underline",
            )}
          >
            Открыть задание →
          </span>
        </CardHeader>
      </Card>
    </Link>
  );
}
