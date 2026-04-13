import Link from "next/link";
import {
  Code2,
  GitBranch,
  Globe,
  Brain,
  Search,
  Database,
  Sparkles,
  Link2,
  Cloud,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  SKILL_TRACKS,
  SKILL_ORDER,
  CATEGORY_LABELS,
} from "@/lib/accenture-training/registry";
import { SkillProgressBadge } from "@/components/accenture-training/SkillProgressBadge";
import type { SkillId } from "@/lib/accenture-training/types";

const SKILL_ICONS: Record<SkillId, React.ElementType> = {
  python: Code2,
  git: GitBranch,
  "rest-api": Globe,
  "llm-basics": Brain,
  rag: Search,
  "vector-databases": Database,
  "prompt-engineering": Sparkles,
  "langchain-langgraph": Link2,
  "cloud-platforms": Cloud,
};

export default function AccentureTrainingHub() {
  const categories = ["core", "genai", "tools"] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-10 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-purple-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            ACN
          </span>
          <Badge variant="outline">GenAI Engineering Internship</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Accenture Training
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Полный курс подготовки к интервью на позицию GenAI Engineering Intern.
          9 навыков, 35 уроков, от нуля до Junior+/Middle. Каждый урок
          завершается практическими заданиями.
        </p>
        <p className="text-sm text-muted-foreground">
          <Link
            href="/"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            &larr; К блиц-наборам
          </Link>
        </p>
      </div>

      {categories.map((cat) => {
        const label = CATEGORY_LABELS[cat];
        const skills = SKILL_ORDER.filter(
          (id) => SKILL_TRACKS[id].category === cat,
        );

        return (
          <section key={cat} className="mb-10">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                {label.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {label.description}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skillId) => (
                <SkillCard key={skillId} skillId={skillId} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function SkillCard({ skillId }: { skillId: SkillId }) {
  const track = SKILL_TRACKS[skillId];
  const Icon = SKILL_ICONS[skillId];

  return (
    <Link href={`/accenture-training/${skillId}`}>
      <Card className="group h-full cursor-pointer overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div
              className={`flex size-9 items-center justify-center rounded-lg ${track.color}`}
            >
              <Icon className="size-4" aria-hidden />
            </div>
            <Badge variant="secondary" className="text-[10px]">
              {track.lessonCount} {track.lessonCount === 1 ? "урок" : track.lessonCount < 5 ? "урока" : "уроков"}
            </Badge>
          </div>
          <CardTitle className="mt-2 text-base leading-snug transition-colors group-hover:text-primary">
            {track.title}
          </CardTitle>
          <CardDescription className="mt-1 text-xs leading-snug">
            {track.description}
          </CardDescription>
          <div className="mt-3 flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-normal">
              ~{track.totalMinutes} мин
            </Badge>
            <SkillProgressBadge skillId={skillId} />
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
