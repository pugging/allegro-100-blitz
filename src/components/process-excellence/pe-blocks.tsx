import type { ReactNode } from "react";

export function PeDataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-border shadow-sm">
      <table className="w-full min-w-[280px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {headers.map((h) => (
              <th
                key={h}
                className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className="border-b border-border/70 last:border-0 odd:bg-background even:bg-muted/20"
            >
              {r.map((c, j) => (
                <td
                  key={j}
                  className="px-3 py-2.5 text-muted-foreground"
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PeStepList({ items }: { items: ReactNode[] }) {
  return (
    <ol className="my-4 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-foreground marker:font-semibold marker:text-primary">
      {items.map((item, i) => (
        <li key={i} className="pl-1">
          {item}
        </li>
      ))}
    </ol>
  );
}

export function PeCallout({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <div className="my-4 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm leading-relaxed text-foreground">
      {title ? (
        <p className="mb-1 font-semibold text-primary">{title}</p>
      ) : null}
      {children}
    </div>
  );
}

export function PePre({ children }: { children: string }) {
  return (
    <pre className="question-code-block my-4 overflow-x-auto rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs leading-relaxed text-foreground">
      <code>{children}</code>
    </pre>
  );
}
