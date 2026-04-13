import type { ReactNode } from "react";
import type { PeTaskId } from "@/lib/process-excellence/registry";
import {
  BottleneckThroughputChart,
  RoiEffortScatter,
} from "@/components/process-excellence/pe-charts";
import { PeDataTable, PePre } from "@/components/process-excellence/pe-blocks";

function AnsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-border/80 py-4 last:border-0 last:pb-0">
      <h3 className="mb-2 text-sm font-semibold text-foreground">{title}</h3>
      <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export function PeTaskAnswers({ id }: { id: PeTaskId }) {
  switch (id) {
    case "1":
      return (
        <>
          <AnsSection title="Расчёт">
            <p>
              Пропускная способность этапа = параллельных линий × (3600 / время
              на 1 шт.)
            </p>
            <PeDataTable
              headers={["Этап", "Расчёт", "п/ч"]}
              rows={[
                ["Сканирование", "4 × (3600 / 12)", "1 200"],
                ["Сортировка", "3 × (3600 / 18)", "600"],
                ["Укладка", "2 × (3600 / 9)", "800"],
              ]}
            />
            <BottleneckThroughputChart />
            <p>
              <strong className="text-foreground">Узкое место:</strong> сортировка.
              Пропускная способность цепочки: <strong>600 п/ч</strong>. Для +15 %
              нужно масштабировать именно этот этап.
            </p>
          </AnsSection>
          <AnsSection title="Для руководителя">
            <p>
              «Хаб обрабатывает не более 600 посылок в час — ограничение на этапе
              сортировки. Добавление одной линии сортировки поднимет потолок до
              800 п/ч (+33 %). Остальные этапы пока не являются ограничениями.»
            </p>
          </AnsSection>
        </>
      );
    case "2":
      return (
        <>
          <PeDataTable
            headers={["Причина", "Кол-во", "Доля", "Кумулятив"]}
            rows={[
              ["Неверный адрес", 420, "42 %", "42 %"],
              ["Не дозвонился", 280, "28 %", "70 %"],
              ["Повреждение", 150, "15 %", "85 %"],
              ["Неправильный хаб", 90, "9 %", "94 %"],
              ["Прочее", 60, "6 %", "100 %"],
            ]}
          />
          <p>
            <strong className="text-foreground">80/20:</strong> адрес + звонок =
            70 % случаев. Действия: валидация геокодинга при оформлении; SMS/push
            за 30 мин до доставки.
          </p>
        </>
      );
    case "3":
      return (
        <>
          <PeDataTable
            headers={["Показатель", "До", "После"]}
            rows={[
              ["Lead Time", "6 ч", "4 ч"],
              ["WIP", "120 × 6 = 720", "120 × 4 = 480"],
              ["Загрузка комплектации", "Высокая", "Средняя"],
            ]}
          />
          <p>
            WIP снизился на <strong>33 %</strong>. Для стейкхолдера: меньше
            очередей при том же потоке — ниже риск ошибок и проще планировать
            смены.
          </p>
        </>
      );
    case "4":
      return (
        <>
          <PePre>{`                    ┌── B (3д) ──┐
                    │             │
        A (5д) ────┤             ├── D (4д) ── E (2д)
                    │             │
                    └── C (8д) ──┘`}</PePre>
          <p>
            Пути: A→B→D→E = <strong>14 дней</strong>; A→C→D→E ={" "}
            <strong>19 дней</strong> — критический путь. Минимальный срок:{" "}
            <strong>19 дней</strong>.
          </p>
          <p>
            Перенос старта B на +2: путь 5+5+4+2 = 16 &lt; 19 —{" "}
            <strong>срок не меняется</strong>, запас на ветке B.
          </p>
          <p>
            C −3 дня: новый критический путь 5+5+4+2 = <strong>16 дней</strong>.
            Овертайм оправдан, если дешевле 3 дней задержки запуска.
          </p>
        </>
      );
    case "5":
      return (
        <>
          <p>
            <strong className="text-foreground">Value-added (25 мин):</strong>{" "}
            переезд к точке (22), передача (2), фото (1).
          </p>
          <p>
            <strong className="text-foreground">Waste (42 мин):</strong> загрузка,
            парковка, звонок, ожидание, ввод в систему.
          </p>
          <p>
            <strong className="text-foreground">PCE</strong> = 25/67 ≈{" "}
            <strong>37,3 %</strong>. После оптимизации парковки и ожидания: общее
            54 мин → <strong>PCE ≈ 46,3 %</strong>.
          </p>
        </>
      );
    case "6":
      return (
        <>
          <p>
            <strong className="text-foreground">C</strong> стабильно ≥ 90 %.{" "}
            <strong className="text-foreground">B</strong> нестабилен (3 из 4
            недель ниже KPI).
          </p>
          <p>
            Гипотезы для B: временная замена курьера на неделе 3; внешние
            факторы / промо на неделе 4.
          </p>
          <p>
            Для A: запросить объёмы, FTE курьеров, разбивку причин опозданий,
            изменения зоны/окна.
          </p>
        </>
      );
    case "7":
      return (
        <>
          <p>
            On-time в окне: 8 650 / 10 000 = <strong>86,5 %</strong>. KPI 90 % —{" "}
            <strong>не выполнен</strong> (−3,5 п.п.).
          </p>
          <PeDataTable
            headers={["Индикатор", "Что мерим", "Порог", "Действие"]}
            rows={[
              [
                "Адрес",
                "% без валид. адреса к T−24ч",
                "> 5 %",
                "Запрос подтверждения адреса",
              ],
              [
                "Курьер",
                "% маршрутов без курьера к утру",
                "> 3 %",
                "Эскалация, резерв",
              ],
              [
                "Хаб",
                "факт / мощность сортировки",
                "> 90 %",
                "Перераспределение объёма",
              ],
            ]}
          />
        </>
      );
    case "8":
      return (
        <>
          <PeDataTable
            headers={["#", "Экономия 6 мес", "Стоимость", "ROI", "NPS Δ"]}
            rows={[
              [1, "72 000", "8 000", "9,0", "+2"],
              [4, "120 000", "18 000", "6,7", "+3"],
              [3, "48 000", "15 000", "3,2", "+1"],
              [2, "30 000", "45 000", "0,7", "+5"],
            ]}
          />
          <RoiEffortScatter className="my-4" />
          <p>
            <strong className="text-foreground">Топ-2:</strong> №1 (чек-лист APM)
            и №4 (оповещение Lead Time). Риск №2 (дашборд): scope creep — MVP с
            2 источниками, затем расширение.
          </p>
        </>
      );
    case "9":
      return (
        <>
          <p>
            Проблема: партнёр хочет окно до 21:00 при риске для NPS (68 %
            против поздней доставки).
          </p>
          <p>
            Факты: рост OTIF и снижение стоимости <em>за</em>; рост жалоб и доля
            после 20:00 <em>против</em>.
          </p>
          <p>
            Компромисс: окно до <strong>20:00</strong> + opt-in до 21:00; пилот в
            одном городе 4 недели.
          </p>
        </>
      );
    default:
      return null;
  }
}
