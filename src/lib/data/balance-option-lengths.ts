import type { AnswerKey, BlitzSet, Question } from "../types";

const KEYS: AnswerKey[] = ["A", "B", "C", "D"];

function charLen(s: string): number {
  return [...s].length;
}

function fnv(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Strips trailing explanation after em-dash, colon, or long parenthetical
 * that duplicates the explanation field.
 */
function trimTail(text: string): string {
  let t = text.trim();
  const dash = t.indexOf(" — ");
  if (dash > 4 && charLen(t) - dash > 18) return t.slice(0, dash).trim();
  const colon = t.lastIndexOf(": ");
  if (colon > 12 && charLen(t) - colon > 28) return t.slice(0, colon).trim();
  t = t.replace(/\s*\([^)]{20,}\)\s*$/, "").trim();
  return t;
}

/* ------------------------------------------------------------------ */
/*  Domain-specific expansion clauses                                   */
/* ------------------------------------------------------------------ */

const CLAUSES: Record<string, string[]> = {
  python: [
    "и возвращает объект соответствующего типа",
    "с поддержкой передачи аргументов по имени",
    "с автоматическим преобразованием типов при необходимости",
    "используя механизм внутренней диспетчеризации интерпретатора",
    "включая обработку граничных значений и исключений",
    "с сохранением ссылки в текущем пространстве имён",
    "через стандартный протокол итерации объектов",
    "с учётом порядка разрешения методов (MRO)",
    "при этом изменяя состояние объекта на месте",
    "с генерацией TypeError при несовместимых операндах",
  ],
  sql: [
    "с учётом порядка обработки предложений запроса",
    "возвращая результирующий набор строк после фильтрации",
    "с группировкой по указанным столбцам таблицы",
    "с использованием индексов для ускорения выборки",
    "при блокировке затронутых строк на время транзакции",
    "после сортировки по указанным критериям",
    "используя план выполнения от оптимизатора",
    "с учётом ограничений целостности данных",
  ],
  financial: [
    "в рамках стандартной финансовой отчётности",
    "за вычетом операционных и внереализационных расходов",
    "с учётом амортизации и курсовых разниц",
    "в пересчёте на единицу проданной продукции",
    "до начисления процентов и налогов (EBIT)",
    "по данным управленческого учёта за период",
    "включая корректировки по переоценке активов",
    "в соответствии с МСФО/GAAP стандартами",
  ],
  logistics: [
    "на этапе формирования маршрута доставки",
    "с учётом ёмкости складских помещений",
    "при оптимизации загрузки транспорта",
    "в рамках управления цепочкой поставок",
    "с привязкой к зонам последней мили",
    "после консолидации заказов на хабе",
    "для минимизации времени обработки",
    "через интеграцию с WMS и TMS",
  ],
  agile: [
    "в соответствии с Agile-манифестом",
    "для непрерывной обратной связи команды",
    "с целью выявления препятствий",
    "при итеративном планировании работ",
    "с участием кросс-функциональной команды",
    "на основе приоритетов Product Owner",
    "в рамках двухнедельного спринта",
    "с фиксацией в бэклоге спринта",
  ],
  ecommerce: [
    "на одного активного покупателя за месяц",
    "с учётом повторных покупок и удержания",
    "при анализе конверсионной воронки",
    "на основе поведения пользователей",
    "включая мобильные транзакции",
    "за вычетом затрат на привлечение (CAC)",
    "с разбивкой по категориям и регионам",
    "в сравнении с прошлым периодом",
  ],
  excel: [
    "с автоматическим пересчётом ячеек",
    "по данным из указанного диапазона",
    "с фильтрацией и сортировкой результатов",
    "при обработке числовых значений",
    "с абсолютными ссылками на ячейки",
    "по сводной таблице с группировкой",
    "с обработкой ошибок через IFERROR",
    "включая поиск через INDEX/MATCH",
  ],
  pm: [
    "с документированием в уставе проекта",
    "при согласовании со стейкхолдерами",
    "в рамках управления изменениями",
    "для минимизации рисков проекта",
    "с отслеживанием отклонений от плана",
    "через статус-встречи с командой",
    "на диаграмме Ганта проекта",
    "до утверждения следующей фазы",
  ],
  rpa: [
    "через настройку селекторов UI-элементов",
    "с обработкой исключений в Try-Catch",
    "в рамках автоматизации процесса",
    "с логированием шагов выполнения",
    "при запуске через Orchestrator",
    "с валидацией входных данных",
    "используя паттерн REFramework",
    "при работе с веб-приложениями",
  ],
  allegro: [
    "в экосистеме группы Allegro",
    "с интеграцией Allegro Pay",
    "на рынке Центральной Европы",
    "через сеть пунктов выдачи",
    "по стандартам платформы",
    "с программой Smart!",
    "при миллионах транзакций в день",
    "на микросервисной архитектуре",
  ],
  git: [
    "с сохранением истории изменений",
    "после разрешения конфликтов слияния",
    "в процессе с feature-ветками",
    "через коммит с описанием",
    "с возможностью отката назад",
    "при синхронизации с remote",
    "используя staged-изменения",
    "с проверкой через pull request",
  ],
  docker: [
    "с изоляцией в контейнере",
    "на основе образа из реестра",
    "с персистентными томами",
    "через Dockerfile конфигурацию",
    "при оркестрации сервисов",
    "с лимитами CPU и памяти",
    "с сетевой изоляцией",
    "после multi-stage сборки",
  ],
  lean: [
    "для устранения потерь в процессе",
    "с визуализацией на канбан-доске",
    "в цикле непрерывного улучшения",
    "при анализе потока ценности",
    "для сокращения времени цикла",
    "через стандартизацию операций",
    "по принципу вытягивания (pull)",
    "с качеством встроенным в процесс",
  ],
  gdpr: [
    "по Регламенту ЕС 2016/679",
    "с правом субъекта на доступ",
    "при обработке на основании согласия",
    "в реестре обработки данных",
    "после оценки воздействия (DPIA)",
    "с уведомлением контролёра",
    "при передаче за пределы ЕЭЗ",
    "по принципу минимизации данных",
  ],
  data: [
    "с описательной статистикой",
    "на основе значимой выборки",
    "после очистки и нормализации",
    "с визуализацией в дашборде",
    "при сегментации по признакам",
    "через корреляционный анализ",
    "с контролем качества данных",
    "с агрегацией по периодам",
  ],
  kpi: [
    "с привязкой к целям подразделения",
    "при мониторинге отклонений",
    "в сбалансированных показателях",
    "для оценки эффективности",
    "с каскадированием целей",
    "по управленческому учёту",
    "в квартальном цикле целей",
    "на информационной панели",
  ],
  generic: [
    "в контексте организации",
    "в рамках стандартных процедур",
    "при заданных сроках и бюджете",
    "на основе отраслевых практик",
    "с документированием результатов",
    "при согласовании со сторонами",
    "для измеримых результатов",
    "с масштабированием при росте",
  ],
};

function domainFor(topic: string): string {
  const t = topic.toLowerCase();
  for (const key of Object.keys(CLAUSES)) {
    if (key !== "generic" && t.includes(key)) return key;
  }
  if (/scrum|kanban|sprint|retrospective/.test(t)) return "agile";
  if (/cost|budget|cash|variance|dcf|capex|profitability|accounting|controlling|working_capital|transfer_pricing|fx_risk/.test(t)) return "financial";
  if (/warehouse|supply_chain|delivery|last_mile|supplier/.test(t)) return "logistics";
  if (/process|bpmn|six_sigma|quality|operational|continuous_improvement/.test(t)) return "lean";
  if (/stakeholder|risk|change|milestone|earned_value|critical_path|project|program/.test(t)) return "pm";
  if (/marketplace|unit_economics|cx/.test(t)) return "ecommerce";
  if (/security|networking|api|ci_cd|testing|design_pattern|system_design|microservice|kubernetes|algorithm|cli|version_control|regex/.test(t)) return "git";
  if (/ai|prompt/.test(t)) return "data";
  if (/reporting|communication|soft_skill|interview|workplace|cross_functional|innovation|strategy|digital_transformation|behavioral/.test(t)) return "pm";
  return "generic";
}

/**
 * Expand text by appending up to 2 domain clauses with varied connectors.
 */
function expand(
  text: string,
  targetLen: number,
  topic: string,
  seed: number,
): string {
  let t = text.trim();
  if (charLen(t) >= targetLen) return t;
  // Skip pure numbers, code tokens, symbols
  if (/^\d+([.,]\d+)?(%| %)?$/.test(t)) return t;
  if (charLen(t) < 3) return t;
  if (/^[<{[\w]+[>}\]]?$/.test(t)) return t; // code-like tokens

  const pool = CLAUSES[domainFor(topic)] ?? CLAUSES["generic"]!;
  let h = seed;
  const next = () => { h = (h * 31 + 7) >>> 0; return h; };

  for (let round = 0; round < 2 && charLen(t) < targetLen; round++) {
    // Try to find a clause that doesn't overshoot too much
    let bestCandidate = "";
    for (let attempt = 0; attempt < pool.length; attempt++) {
      const clause = pool[next() % pool.length]!;
      if (t.includes(clause)) continue;

      let sep: string;
      if (t.endsWith(")") || t.endsWith(".")) {
        sep = " ";
      } else {
        // Append with comma only ~25-30% of the time; never use dash.
        // Ensure the clause reads naturally after the connector.
        const n = next();
        if (n % 4 === 0) {
          sep = ", ";
        } else {
          sep = " ";
        }
      }

      const candidate = t + sep + clause;
      // On first round, allow generous overshoot; on second, be tighter
      const maxOvershoot = round === 0 ? 1.5 : 1.3;
      if (charLen(candidate) <= targetLen * maxOvershoot) {
        bestCandidate = candidate;
        break;
      }
      // If all clauses overshoot, keep the smallest overshoot
      if (!bestCandidate || charLen(candidate) < charLen(bestCandidate)) {
        bestCandidate = candidate;
      }
    }

    if (bestCandidate && charLen(bestCandidate) <= targetLen * 1.6) {
      t = bestCandidate;
    } else {
      break;
    }
  }
  return t;
}

function balanceQuestionOptions(q: Question): Question {
  const opts: Record<AnswerKey, string> = { ...q.options };
  const wrongKeys = KEYS.filter((k) => k !== q.correct);
  const len = (k: AnswerKey) => charLen(opts[k]!);
  const hash = fnv(q.id);

  // Step 1: Trim redundant tails from correct answer (em-dash explanations, etc.)
  const trimmed = trimTail(opts[q.correct]!);
  if (charLen(trimmed) < len(q.correct) && charLen(trimmed) >= 8) {
    opts[q.correct] = trimmed;
  }

  // Step 2: Expand wrong answers that are notably shorter than correct.
  const cLen = len(q.correct);
  for (const k of wrongKeys) {
    if (len(k) < cLen * 0.75) {
      opts[k] = expand(opts[k]!, Math.floor(cLen * 0.85), q.topic, fnv(`${q.id}_${k}`));
    }
  }

  // Step 3: Second pass — if any wrong is still <60% of correct, push harder
  for (const k of wrongKeys) {
    if (len(k) < len(q.correct) * 0.6) {
      opts[k] = expand(opts[k]!, Math.floor(len(q.correct) * 0.75), q.topic, fnv(`${q.id}_${k}_2`));
    }
  }

  // Step 4: If correct is still >15% longer than the longest wrong, trim
  const maxWrong = Math.max(...wrongKeys.map((k) => len(k)));
  if (len(q.correct) > maxWrong * 1.15 && len(q.correct) > 25) {
    const shorter = trimTail(opts[q.correct]!);
    if (charLen(shorter) >= 10) opts[q.correct] = shorter;
  }

  // Step 5: If correct is shorter than median wrong, expand it
  const medianWrong = wrongKeys.map((k) => len(k)).sort((a, b) => a - b)[1]!;
  if (len(q.correct) < medianWrong * 0.75) {
    opts[q.correct] = expand(
      opts[q.correct]!,
      Math.floor(medianWrong * 0.85),
      q.topic,
      fnv(`${q.id}_correct`),
    );
  }

  // (No Step 6 — expansion artifact mitigation handled at clause level)

  // Step 7: PARENS BALANCE — if correct has parens and no wrong does,
  // add a parenthetical to one wrong answer to break the "only-parens = correct" tell.
  const correctHasParens = /\(/.test(opts[q.correct]!);
  const wrongWithParens = wrongKeys.filter((k) => /\(/.test(opts[k]!));
  if (correctHasParens && wrongWithParens.length === 0) {
    // Pick one wrong answer deterministically and add a parenthetical
    const targetK = wrongKeys[hash % wrongKeys.length]!;
    const t = opts[targetK]!;
    // Only if it looks natural (not too short, not code)
    if (charLen(t) > 15 && !/^[<{]/.test(t)) {
      const parenOptions = [
        " (по умолчанию)",
        " (в общем случае)",
        " (на практике)",
        " (условно)",
        " (формально)",
        " (в теории)",
      ];
      opts[targetK] = t + parenOptions[hash % parenOptions.length]!;
    }
  }

  return { ...q, options: opts };
}

function balanceCategory(cat: BlitzSet["categories"][0]): typeof cat {
  return {
    ...cat,
    questions: cat.questions.map((q) => balanceQuestionOptions(q)) as typeof cat.questions,
  };
}

export function balanceOptionLengthsInSets(sets: BlitzSet[]): BlitzSet[] {
  return sets.map((set) => ({
    ...set,
    categories: set.categories.map(balanceCategory) as typeof set.categories,
  }));
}
