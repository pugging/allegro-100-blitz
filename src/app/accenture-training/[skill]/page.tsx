import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SKILL_TRACKS } from "@/lib/accenture-training/registry";
import { getLessonIdsForSkill, loadLesson } from "@/lib/accenture-training/lessons";
import { LessonCompletionBadge } from "@/components/accenture-training/LessonCompletionBadge";
import { SkillProgressBadge } from "@/components/accenture-training/SkillProgressBadge";
import type { SkillId } from "@/lib/accenture-training/types";

interface PageProps {
  params: Promise<{ skill: string }>;
}

export default async function SkillOverviewPage({ params }: PageProps) {
  const { skill } = await params;

  if (!(skill in SKILL_TRACKS)) notFound();

  const skillId = skill as SkillId;
  const track = SKILL_TRACKS[skillId];
  const lessonIds = getLessonIdsForSkill(skillId);

  const lessons = await Promise.all(lessonIds.map((id) => loadLesson(id)));
  const validLessons = lessons.filter(Boolean);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <p className="mb-3 text-sm text-muted-foreground">
          <Link
            href="/accenture-training"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            &larr; Все навыки
          </Link>
        </p>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="rounded-lg bg-purple-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            ACN
          </span>
          <Badge variant="outline">{track.shortTitle}</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {track.title}
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {track.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {track.lessonCount} {track.lessonCount < 5 ? "урока" : "уроков"}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            ~{track.totalMinutes} мин
          </Badge>
          <SkillProgressBadge skillId={skillId} />
        </div>
      </div>

      <div className="space-y-3">
        {validLessons.map((lesson, idx) => {
          if (!lesson) return null;
          const slug = lesson.id.replace(`${skillId}-`, "");

          return (
            <Link
              key={lesson.id}
              href={`/accenture-training/${skillId}/${slug}`}
            >
              <Card className="group cursor-pointer overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md mb-3">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                      {idx + 1}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      ~{lesson.estimatedMinutes} мин
                    </Badge>
                  </div>
                  <CardTitle className="mt-1 text-base leading-snug transition-colors group-hover:text-primary">
                    {lesson.title}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {lesson.subtitle}
                  </CardDescription>
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    <Badge variant="outline" className="text-[10px] font-normal">
                      {lesson.exercises.length} заданий
                    </Badge>
                    <LessonCompletionBadge lessonId={lesson.id} />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
