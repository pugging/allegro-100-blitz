import Link from "next/link";
import { notFound } from "next/navigation";
import { SKILL_TRACKS } from "@/lib/accenture-training/registry";
import { getLessonIdBySlug, loadLesson } from "@/lib/accenture-training/lessons";
import { LessonViewer } from "@/components/accenture-training/LessonViewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SkillId } from "@/lib/accenture-training/types";

interface PageProps {
  params: Promise<{ skill: string; lessonId: string }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { skill, lessonId: slug } = await params;

  if (!(skill in SKILL_TRACKS)) notFound();

  const skillId = skill as SkillId;
  const track = SKILL_TRACKS[skillId];
  const lessonId = getLessonIdBySlug(skillId, slug);

  if (!lessonId) notFound();

  const lesson = await loadLesson(lessonId);
  if (!lesson) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <p className="mb-3 text-sm text-muted-foreground">
          <Link
            href={`/accenture-training/${skillId}`}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            &larr; {track.title}
          </Link>
        </p>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="rounded-lg bg-purple-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            ACN
          </span>
          <Badge variant="outline">{track.shortTitle}</Badge>
          <Badge variant="secondary" className="text-[10px]">
            Урок {lesson.order}
          </Badge>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {lesson.title}
        </h1>
        <p className="mt-1 text-base text-muted-foreground">
          {lesson.subtitle}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="text-[10px]">
            ~{lesson.estimatedMinutes} мин
          </Badge>
        </div>
      </div>

      {lesson.objectives.length > 0 && (
        <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <h2 className="mb-2 text-sm font-semibold text-primary">
            После этого урока вы сможете:
          </h2>
          <ul className="space-y-1">
            {lesson.objectives.map((obj, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <span className="mt-0.5 text-primary">&#10003;</span>
                {obj}
              </li>
            ))}
          </ul>
        </div>
      )}

      <LessonViewer content={lesson.content} />

      {lesson.keyTakeaways.length > 0 && (
        <div className="mt-10 rounded-xl border border-border/60 bg-card p-5">
          <h2 className="mb-3 text-base font-semibold text-foreground">
            Key Takeaways
          </h2>
          <ul className="space-y-2">
            {lesson.keyTakeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 text-primary font-bold">{i + 1}.</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {lesson.interviewTips.length > 0 && (
        <div className="mt-6 rounded-xl border border-amber-300/30 bg-amber-50/50 p-5">
          <h2 className="mb-3 text-base font-semibold text-amber-700">
            Interview Tips
          </h2>
          <ul className="space-y-2">
            {lesson.interviewTips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-amber-900"
              >
                <span className="mt-0.5">&#128161;</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Link href={`/accenture-training/${skillId}/${slug}/grill`}>
          <Button size="lg" className="px-8">
            Начать задания ({lesson.exercises.length}) &rarr;
          </Button>
        </Link>
      </div>
    </div>
  );
}
