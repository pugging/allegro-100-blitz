"use client";

import { Fragment, type ReactNode } from "react";

const PYTHON_KW = new Set([
  "def",
  "class",
  "return",
  "import",
  "from",
  "if",
  "elif",
  "else",
  "for",
  "while",
  "pass",
  "None",
  "True",
  "False",
  "in",
  "not",
  "or",
  "and",
  "is",
  "as",
  "lambda",
  "with",
  "try",
  "except",
  "finally",
  "raise",
  "yield",
  "async",
  "await",
  "global",
  "nonlocal",
  "del",
  "assert",
  "break",
  "continue",
]);

const SQL_KW = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "ORDER",
  "BY",
  "OVER",
  "PARTITION",
  "HAVING",
  "COUNT",
  "RANK",
  "AS",
  "JOIN",
  "GROUP",
  "INNER",
  "LEFT",
  "RIGHT",
  "OUTER",
  "ON",
  "AND",
  "OR",
  "NOT",
  "NULL",
  "DISTINCT",
  "CASE",
  "WHEN",
  "THEN",
  "END",
  "LAG",
  "LEAD",
  "SUM",
  "AVG",
  "MIN",
  "MAX",
  "WINDOW",
]);

const BUILTINS = new Set([
  "print",
  "range",
  "len",
  "type",
  "append",
  "copy",
  "super",
  "isinstance",
  "hasattr",
  "getattr",
  "setattr",
  "open",
  "int",
  "str",
  "float",
  "list",
  "dict",
  "set",
  "tuple",
  "enumerate",
  "zip",
  "map",
  "filter",
  "sorted",
  "abs",
  "min",
  "max",
  "sum",
  "round",
  "repr",
  "format",
  "next",
  "iter",
  "all",
  "any",
]);

const TOKEN_CLASS = {
  kw: "text-[color:var(--primary)] font-medium",
  sqlKw: "text-[color:var(--primary)] font-medium",
  builtin: "text-[color:var(--secondary-brand)]",
  string: "text-[color:var(--success)]",
  number: "text-[color:var(--warning)]",
  comment: "text-muted-foreground italic",
  default: "text-foreground",
} as const;

/** Строка похожа на строку кода (Python/SQL), а не на русский текст вопроса. */
function isCodeLine(line: string): boolean {
  const t = line.trim();
  if (!t) return false;

  if (/[а-яёА-ЯЁ]/.test(t)) {
    return /^(SELECT|INSERT|UPDATE|DELETE|WITH|CREATE)\b/i.test(t);
  }

  if (
    /^(def|class|import|from|print|for|while|if|return|try|except|with|elif|else|pass)\b/.test(
      t,
    )
  ) {
    return true;
  }
  if (/^SELECT\b/i.test(t)) return true;
  if (/^\s{2,}\S/.test(line)) return true;
  if (/^[a-zA-Z_]\w*\s*=/.test(t)) return true;
  if (/^[a-zA-Z_]\w*\([^)]*\)\s*(#.*)?$/.test(t)) return true;
  if (/^(FROM|WHERE|HAVING|ORDER|GROUP|JOIN|ON)\b/i.test(t)) return true;

  return false;
}

function looksLikeWholeCodeBlock(segment: string): boolean {
  const s = segment.trim();
  if (!s) return false;
  if (s.includes("\n")) {
    const lines = s.split("\n").filter((l) => l.trim());
    if (lines.length === 0) return false;
    return lines.every((l) => isCodeLine(l));
  }
  return isCodeLine(s);
}

type Run = { kind: "prose" | "code"; text: string };

/** Соседние блоки `code` (часто из-за пустой строки `\n\n` внутри одного примера) — один `<pre>`. */
function mergeAdjacentCodeRuns(runs: Run[]): Run[] {
  const out: Run[] = [];
  for (const r of runs) {
    const last = out[out.length - 1];
    if (r.kind === "code" && last?.kind === "code") {
      last.text = `${last.text}\n\n${r.text}`;
    } else {
      out.push({ kind: r.kind, text: r.text });
    }
  }
  return out;
}

/** Внутри одного абзаца (между \n\n): чередование текста и кода при одном \n. */
function splitPartIntoRuns(part: string): Run[] {
  const lines = part.split("\n");
  const runs: Run[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i]!;
    if (!isCodeLine(line)) {
      const start = i;
      while (i < lines.length && !isCodeLine(lines[i]!)) i++;
      const prose = lines
        .slice(start, i)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (prose) runs.push({ kind: "prose", text: prose });
    } else {
      const start = i;
      while (i < lines.length) {
        const L = lines[i]!;
        if (isCodeLine(L)) {
          i++;
          continue;
        }
        if (L.trim() === "" && i + 1 < lines.length && isCodeLine(lines[i + 1]!)) {
          i++;
          continue;
        }
        break;
      }
      const raw = lines.slice(start, i).join("\n").replace(/\s+$/, "");
      if (raw.trim()) runs.push({ kind: "code", text: raw });
    }
  }

  return runs;
}

function parseQuestionToRuns(text: string): Run[] {
  const paragraphs = text.split(/\n\n+/);
  const all: Run[] = [];

  for (const para of paragraphs) {
    const p = para.trim();
    if (!p) continue;

    if (!p.includes("\n")) {
      all.push({
        kind: looksLikeWholeCodeBlock(p) ? "code" : "prose",
        text: p,
      });
      continue;
    }

    if (looksLikeWholeCodeBlock(p)) {
      all.push({ kind: "code", text: p });
      continue;
    }

    all.push(...splitPartIntoRuns(p));
  }

  return mergeAdjacentCodeRuns(all);
}

/**
 * Простая лексическая раскраска Python/SQL без внешних зависимостей.
 */
function highlightCode(code: string): ReactNode[] {
  const lines = code.split("\n");
  const out: ReactNode[] = [];

  const tokenizeLine = (line: string, lineKey: string): ReactNode[] => {
    const nodes: ReactNode[] = [];
    let i = 0;
    let buf = "";

    const flush = () => {
      if (buf) {
        nodes.push(
          <span key={`${lineKey}-t${nodes.length}`} className={TOKEN_CLASS.default}>
            {buf}
          </span>,
        );
        buf = "";
      }
    };

    const pushSpan = (text: string, cls: string) => {
      flush();
      nodes.push(
        <span key={`${lineKey}-t${nodes.length}`} className={cls}>
          {text}
        </span>,
      );
    };

    while (i < line.length) {
      if (line[i] === "#") {
        pushSpan(line.slice(i), TOKEN_CLASS.comment);
        break;
      }
      if (line.slice(i, i + 2) === "--") {
        pushSpan(line.slice(i), TOKEN_CLASS.comment);
        break;
      }

      if (line[i] === "'") {
        flush();
        let j = i + 1;
        while (j < line.length) {
          if (line[j] === "\\" && j + 1 < line.length) {
            j += 2;
            continue;
          }
          if (line[j] === "'") {
            j++;
            break;
          }
          j++;
        }
        pushSpan(line.slice(i, j), TOKEN_CLASS.string);
        i = j;
        continue;
      }

      if (line[i] === '"') {
        flush();
        let j = i + 1;
        while (j < line.length) {
          if (line[j] === "\\" && j + 1 < line.length) {
            j += 2;
            continue;
          }
          if (line[j] === '"') {
            j++;
            break;
          }
          j++;
        }
        pushSpan(line.slice(i, j), TOKEN_CLASS.string);
        i = j;
        continue;
      }

      if (/[0-9]/.test(line[i]!)) {
        flush();
        let j = i;
        while (j < line.length && /[0-9._eE+-]/.test(line[j]!)) j++;
        pushSpan(line.slice(i, j), TOKEN_CLASS.number);
        i = j;
        continue;
      }

      if (/[A-Za-z_]/.test(line[i]!)) {
        flush();
        let j = i;
        while (j < line.length && /[A-Za-z0-9_]/.test(line[j]!)) j++;
        const word = line.slice(i, j);
        const upper = word.toUpperCase();
        if (SQL_KW.has(upper)) {
          pushSpan(word, TOKEN_CLASS.sqlKw);
        } else if (PYTHON_KW.has(word)) {
          pushSpan(word, TOKEN_CLASS.kw);
        } else if (BUILTINS.has(word)) {
          pushSpan(word, TOKEN_CLASS.builtin);
        } else {
          buf = word;
          flush();
        }
        i = j;
        continue;
      }

      buf += line[i]!;
      i++;
    }
    flush();
    return nodes;
  };

  lines.forEach((line, li) => {
    out.push(
      <Fragment key={`L${li}`}>
        {li > 0 ? "\n" : null}
        {tokenizeLine(line, `L${li}`)}
      </Fragment>,
    );
  });

  return out;
}

/** Инлайн: короткие фрагменты вроде TypeError, [1, 2], foo() */
function highlightInline(text: string): ReactNode {
  const parts = text.split(
    /(`[^`]+`|\[[^\]]+\]|[A-Za-z_][A-Za-z0-9_]*\s*\([^)]*\)|[A-Za-z_][A-Za-z0-9_]*Error\b)/g,
  );
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="rounded bg-muted/80 px-1 py-0.5 font-mono text-[0.9em] text-foreground"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        /* Только «настоящие» фрагменты кода: не считать конец «…текст (ЦВЕ)» кодом */
        if (
          /^\[[^\]]+\]$/.test(part) ||
          /^[A-Za-z_][A-Za-z0-9_]*\s*\([^)]*\)$/.test(part) ||
          /^[A-Za-z_][A-Za-z0-9_]*Error$/.test(part)
        ) {
          return (
            <code
              key={i}
              className="rounded bg-muted/80 px-1 py-0.5 font-mono text-[0.9em] text-[color:var(--secondary-brand)]"
            >
              {part}
            </code>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

export interface QuestionTextProps {
  text: string;
  /** prose: вопрос с блоками кода; inline: вариант ответа */
  variant?: "prose" | "inline";
  className?: string;
}

export function QuestionText({
  text,
  variant = "prose",
  className = "",
}: QuestionTextProps) {
  if (variant === "inline") {
    return (
      <span className={`text-sm leading-relaxed ${className}`}>
        {highlightInline(text)}
      </span>
    );
  }

  const runs = parseQuestionToRuns(text);

  return (
    <div className={`space-y-3 ${className}`}>
      {runs.map((run, idx) => {
        if (run.kind === "code") {
          return (
            <pre
              key={idx}
              className="question-code-block overflow-x-auto rounded-xl border border-border/60 bg-muted/40 p-4 text-left text-sm leading-relaxed shadow-inner dark:bg-muted/25"
              tabIndex={0}
            >
              <code className="font-mono text-[0.8125rem] sm:text-sm">
                {highlightCode(run.text.replace(/\n+$/, ""))}
              </code>
            </pre>
          );
        }

        return (
          <p
            key={idx}
            className="text-lg font-medium leading-relaxed text-foreground"
          >
            {highlightInline(run.text)}
          </p>
        );
      })}
    </div>
  );
}
