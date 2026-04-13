import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  isPeTaskId,
  PE_TASK_IDS,
  PE_TASK_META,
} from "@/lib/process-excellence/registry";
import { ProcessExcellenceTaskClient } from "../ProcessExcellenceTaskClient";

export function generateStaticParams() {
  return PE_TASK_IDS.map((id) => ({ id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!isPeTaskId(id)) return { title: "Задание не найдено" };
  const meta = PE_TASK_META[id];
  return {
    title: `PE · Задание ${id}: ${meta.title}`,
    description: meta.short,
  };
}

export default async function ProcessExcellenceTaskPage({ params }: Props) {
  const { id } = await params;
  if (!isPeTaskId(id)) notFound();
  return <ProcessExcellenceTaskClient taskId={id} />;
}
