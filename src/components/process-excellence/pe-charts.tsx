import { cn } from "@/lib/utils";

/** Горизонтальные бары пропускной способности (задание 1) */
export function BottleneckThroughputChart({
  className,
}: {
  className?: string;
}) {
  const rows = [
    { label: "Сканирование", value: 1200, color: "var(--chart-1)" },
    { label: "Сортировка", value: 600, color: "var(--chart-5)", highlight: true },
    { label: "Укладка", value: 800, color: "var(--chart-4)" },
  ];
  const max = 1200;
  return (
    <figure
      className={cn(
        "rounded-xl border border-border bg-card p-4 shadow-sm",
        className,
      )}
      aria-label="Сравнение пропускной способности этапов в посылках в час"
    >
      <figcaption className="mb-3 text-xs font-medium text-muted-foreground">
        Посылки / час (после решения задания)
      </figcaption>
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span
                className={cn(
                  r.highlight && "font-semibold text-foreground",
                )}
              >
                {r.label}
                {r.highlight ? " — узкое место" : ""}
              </span>
              <span className="font-mono tabular-nums text-muted-foreground">
                {r.value}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(r.value / max) * 100}%`,
                  backgroundColor: r.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

/** Линейный график OTIF по неделям (задание 6) */
export function OtifRoutesLineChart({ className }: { className?: string }) {
  const w = 420;
  const h = 200;
  const padL = 44;
  const padR = 12;
  const padT = 16;
  const padB = 36;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const yMin = 65;
  const yMax = 100;

  const series = [
    { name: "Маршрут A", color: "var(--chart-1)", values: [91, 90, 89, 85] },
    { name: "Маршрут B", color: "var(--chart-5)", values: [80, 75, 94, 70] },
    { name: "Маршрут C", color: "var(--chart-3)", values: [95, 96, 95, 97] },
  ];

  const xAt = (i: number) => padL + (i / 3) * plotW;
  const yAt = (v: number) =>
    padT + ((yMax - v) / (yMax - yMin)) * plotH;

  const gridYs = [70, 80, 90, 100];

  return (
    <figure
      className={cn(
        "rounded-xl border border-border bg-card p-3 shadow-sm",
        className,
      )}
      aria-label="OTIF по неделям для трёх маршрутов"
    >
      <figcaption className="mb-2 px-1 text-xs font-medium text-muted-foreground">
        OTIF, % — визуализация таблицы из задания
      </figcaption>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full max-w-full"
        role="img"
      >
        {gridYs.map((gy) => {
          const y = yAt(gy);
          return (
            <g key={gy}>
              <line
                x1={padL}
                y1={y}
                x2={w - padR}
                y2={y}
                stroke="var(--border)"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <text
                x={4}
                y={y + 4}
                className="fill-muted-foreground text-[10px]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {gy}%
              </text>
            </g>
          );
        })}
        <line
          x1={padL}
          y1={yAt(90)}
          x2={w - padR}
          y2={yAt(90)}
          stroke="var(--warning)"
          strokeWidth={1}
          strokeDasharray="6 3"
          opacity={0.85}
        />
        <text
          x={padL + 4}
          y={yAt(90) - 4}
          className="fill-[color:var(--warning)] text-[9px] font-medium"
        >
          KPI 90%
        </text>
        {series.map((s) => {
          const d = s.values
            .map((v, i) => `${i === 0 ? "M" : "L"} ${xAt(i)} ${yAt(v)}`)
            .join(" ");
          return (
            <g key={s.name}>
              <path
                d={d}
                fill="none"
                stroke={s.color}
                strokeWidth={2.25}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {s.values.map((v, i) => (
                <circle
                  key={i}
                  cx={xAt(i)}
                  cy={yAt(v)}
                  r={4}
                  fill="var(--card)"
                  stroke={s.color}
                  strokeWidth={2}
                />
              ))}
            </g>
          );
        })}
        {[0, 1, 2, 3].map((i) => (
          <text
            key={i}
            x={xAt(i)}
            y={h - 10}
            textAnchor="middle"
            className="fill-muted-foreground text-[10px]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Нед.{i + 1}
          </text>
        ))}
      </svg>
      <ul className="mt-2 flex flex-wrap gap-3 border-t border-border/80 px-1 pt-2 text-[11px] text-muted-foreground">
        {series.map((s) => (
          <li key={s.name} className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: s.color }}
              aria-hidden
            />
            {s.name}
          </li>
        ))}
      </ul>
    </figure>
  );
}

/** Pareto: столбцы + линия кумулятива (задание 2) */
export function ParetoComboChart({ className }: { className?: string }) {
  const data = [
    { label: "Адрес", count: 420 },
    { label: "Звонок", count: 280 },
    { label: "Повр.", count: 150 },
    { label: "Хаб", count: 90 },
    { label: "Проч.", count: 60 },
  ];
  const total = 1000;
  let cum = 0;
  const withCum = data.map((d) => {
    cum += d.count;
    return { ...d, cumPct: (cum / total) * 100 };
  });
  const maxCount = 420;
  const barW = 48;
  const gap = 18;
  const w = data.length * (barW + gap) + 60;
  const h = 200;
  const baseY = 160;
  const plotH = 120;

  return (
    <figure
      className={cn(
        "rounded-xl border border-border bg-card p-3 shadow-sm",
        className,
      )}
    >
      <figcaption className="mb-2 text-xs font-medium text-muted-foreground">
        Pareto: частоты и накопленный %
      </figcaption>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img">
        {withCum.map((d, i) => {
          const x = 40 + i * (barW + gap);
          const bh = (d.count / maxCount) * plotH;
          return (
            <g key={d.label}>
              <rect
                x={x}
                y={baseY - bh}
                width={barW}
                height={bh}
                rx={4}
                fill="var(--chart-1)"
                opacity={0.85}
              />
              <text
                x={x + barW / 2}
                y={baseY + 14}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
              >
                {d.label}
              </text>
            </g>
          );
        })}
        <polyline
          fill="none"
          stroke="var(--chart-2)"
          strokeWidth={2}
          points={withCum
            .map((d, i) => {
              const x = 40 + i * (barW + gap) + barW / 2;
              const y = baseY - (d.cumPct / 100) * plotH;
              return `${x},${y}`;
            })
            .join(" ")}
        />
        {withCum.map((d, i) => {
          const x = 40 + i * (barW + gap) + barW / 2;
          const y = baseY - (d.cumPct / 100) * plotH;
          return (
            <circle key={i} cx={x} cy={y} r={3} fill="var(--chart-2)" />
          );
        })}
        <text x={4} y={24} className="fill-muted-foreground text-[9px]">
          Кумулятив %
        </text>
      </svg>
    </figure>
  );
}

/** ROI vs FTE-недели (задание 8) */
export function RoiEffortScatter({ className }: { className?: string }) {
  const pts = [
    { id: "1", fte: 3, roi: 9, label: "APM" },
    { id: "2", fte: 10, roi: 0.7, label: "Дашборд" },
    { id: "3", fte: 6, roi: 3.2, label: "SOP" },
    { id: "4", fte: 5, roi: 6.7, label: "LT alert" },
  ];
  const w = 360;
  const h = 200;
  const pad = 36;
  const maxX = 11;
  const maxY = 10;
  const px = (x: number) => pad + (x / maxX) * (w - pad * 2);
  const py = (y: number) => h - pad - (y / maxY) * (h - pad * 2);

  return (
    <figure
      className={cn(
        "rounded-xl border border-border bg-card p-3 shadow-sm",
        className,
      )}
    >
      <figcaption className="mb-2 text-xs font-medium text-muted-foreground">
        ROI (6 мес) vs трудозатраты (FTE-нед.) — после расчёта
      </figcaption>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img">
        <line
          x1={pad}
          y1={h - pad}
          x2={w - pad}
          y2={h - pad}
          stroke="var(--border)"
          strokeWidth={1}
        />
        <line
          x1={pad}
          y1={pad}
          x2={pad}
          y2={h - pad}
          stroke="var(--border)"
          strokeWidth={1}
        />
        <text
          x={w / 2}
          y={h - 8}
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          FTE-нед.
        </text>
        <text
          x={12}
          y={h / 2}
          className="fill-muted-foreground text-[9px]"
          transform={`rotate(-90 12 ${h / 2})`}
        >
          ROI
        </text>
        {pts.map((p) => (
          <g key={p.id}>
            <circle
              cx={px(p.fte)}
              cy={py(p.roi)}
              r={p.id === "1" || p.id === "4" ? 10 : 8}
              fill={
                p.id === "1" || p.id === "4"
                  ? "var(--chart-3)"
                  : "var(--chart-1)"
              }
              opacity={0.9}
            />
            <text
              x={px(p.fte)}
              y={py(p.roi) + 3}
              textAnchor="middle"
              className="fill-primary-foreground text-[8px] font-bold"
            >
              {p.id}
            </text>
          </g>
        ))}
      </svg>
      <p className="mt-1 text-[10px] text-muted-foreground">
        Крупнее отмечены кандидаты в топ-2 по ROI из ключа (1 и 4).
      </p>
    </figure>
  );
}

/** Сеть CPM (задание 4) */
export function CpmNetworkDiagram({ className }: { className?: string }) {
  const nodes = [
    { id: "A", x: 50, y: 110, d: 5 },
    { id: "B", x: 170, y: 50, d: 3 },
    { id: "C", x: 170, y: 170, d: 8 },
    { id: "D", x: 300, y: 110, d: 4 },
    { id: "E", x: 410, y: 110, d: 2 },
  ];
  const edges = [
    ["A", "B"],
    ["A", "C"],
    ["B", "D"],
    ["C", "D"],
    ["D", "E"],
  ] as const;

  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <figure
      className={cn(
        "rounded-xl border border-border bg-card p-3 shadow-sm",
        className,
      )}
    >
      <figcaption className="mb-2 text-xs font-medium text-muted-foreground">
        Сеть зависимостей (подсказка к построению)
      </figcaption>
      <svg viewBox="0 0 460 230" className="h-auto w-full" role="img">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="var(--muted-foreground)" />
          </marker>
        </defs>
        {edges.map(([from, to]) => {
          const a = byId[from]!;
          const b = byId[to]!;
          return (
            <line
              key={`${from}-${to}`}
              x1={a.x + 22}
              y1={a.y}
              x2={b.x - 22}
              y2={b.y}
              stroke="var(--muted-foreground)"
              strokeWidth={1.5}
              markerEnd="url(#arrowhead)"
            />
          );
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <rect
              x={n.x - 24}
              y={n.y - 22}
              width={48}
              height={44}
              rx={8}
              fill="var(--secondary)"
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text
              x={n.x}
              y={n.y - 4}
              textAnchor="middle"
              className="fill-foreground text-[13px] font-semibold"
            >
              {n.id}
            </text>
            <text
              x={n.x}
              y={n.y + 12}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px] font-mono"
            >
              {n.d}д
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
