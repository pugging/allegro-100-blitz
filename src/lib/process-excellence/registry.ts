export const PE_TASK_IDS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
] as const;

export type PeTaskId = (typeof PE_TASK_IDS)[number];

export function isPeTaskId(id: string): id is PeTaskId {
  return (PE_TASK_IDS as readonly string[]).includes(id);
}

export const PE_BLOCK_LABELS: Record<
  "A" | "B" | "C" | "D",
  { title: string; description: string }
> = {
  A: {
    title: "Блок A",
    description: "Количественное мышление",
  },
  B: {
    title: "Блок B",
    description: "Пространственное и логическое мышление",
  },
  C: {
    title: "Блок C",
    description: "Анализ данных и трендов",
  },
  D: {
    title: "Блок D",
    description: "Решения на основе данных",
  },
};

export const PE_TASK_META: Record<
  PeTaskId,
  {
    block: keyof typeof PE_BLOCK_LABELS;
    title: string;
    short: string;
    estimatedMin: number;
  }
> = {
  "1": {
    block: "A",
    title: "Пропускная способность и узкое место",
    short: "Throughput / bottleneck",
    estimatedMin: 15,
  },
  "2": {
    block: "A",
    title: "Pareto-анализ причин задержек",
    short: "Pareto",
    estimatedMin: 20,
  },
  "3": {
    block: "A",
    title: "Lead Time, WIP и закон Литтла",
    short: "Little's Law",
    estimatedMin: 12,
  },
  "4": {
    block: "B",
    title: "Критический путь (сеть зависимостей)",
    short: "CPM",
    estimatedMin: 25,
  },
  "5": {
    block: "B",
    title: "Процесс доставки: маппинг и потери (Lean)",
    short: "Lean / PCE",
    estimatedMin: 25,
  },
  "6": {
    block: "C",
    title: "Чтение дашборда: тренды по маршрутам",
    short: "OTIF тренды",
    estimatedMin: 20,
  },
  "7": {
    block: "C",
    title: "OTIF / SLA и опережающие индикаторы",
    short: "SLA / leading",
    estimatedMin: 18,
  },
  "8": {
    block: "D",
    title: "Приоритизация инициатив (data-driven)",
    short: "ROI / приоритеты",
    estimatedMin: 22,
  },
  "9": {
    block: "D",
    title: "Ситуационный анализ: компромисс со стейкхолдером",
    short: "SJT / партнёр",
    estimatedMin: 25,
  },
};
