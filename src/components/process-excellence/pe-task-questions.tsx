import type { PeTaskId } from "@/lib/process-excellence/registry";
import {
  CpmNetworkDiagram,
  OtifRoutesLineChart,
  ParetoComboChart,
} from "@/components/process-excellence/pe-charts";
import {
  PeCallout,
  PeDataTable,
  PePre,
  PeStepList,
} from "@/components/process-excellence/pe-blocks";

export function PeTaskQuestions({ id }: { id: PeTaskId }) {
  switch (id) {
    case "1":
      return (
        <>
          <p className="text-sm leading-relaxed text-muted-foreground">
            На сортировочном хабе три последовательных этапа обработки одной
            посылки:
          </p>
          <PeDataTable
            headers={["Этап", "Время на 1 посылку", "Параллельных линий"]}
            rows={[
              ["Сканирование", "12 с", 4],
              ["Сортировка по зонам", "18 с", 3],
              ["Укладка в мешок маршрута", "9 с", 2],
            ]}
          />
          <PeStepList
            items={[
              <>
                Посчитай <strong>пропускную способность</strong> каждого этапа
                в <strong>посылках/час</strong> (учти параллельные линии).
              </>,
              <>
                Укажи <strong>узкое место</strong> (bottleneck) и{" "}
                <strong>пропускную способность всей цепочки</strong>.
              </>,
              <>
                Если нужно поднять общую пропускную способность на{" "}
                <strong>15 %</strong>, на каком этапе это дешевле начинать и
                почему?
              </>,
              <>
                Сформулируй вывод <strong>для руководителя хаба</strong> в 2–3
                предложениях (без формул).
              </>,
            ]}
          />
        </>
      );
    case "2":
      return (
        <>
          <p className="text-sm leading-relaxed text-muted-foreground">
            За месяц зафиксированы причины неудачной первой попытки доставки:
          </p>
          <PeDataTable
            headers={["Причина", "Количество"]}
            rows={[
              ["Неверный адрес / геокодинг", 420],
              ["Курьер не дозвонился", 280],
              ["Пакет повреждён при сортировке", 150],
              ["Сортировка на неправильный хаб", 90],
              ["Прочее", 60],
            ]}
          />
          <ParetoComboChart className="my-4" />
          <PeStepList
            items={[
              <>
                Посчитай <strong>долю каждой причины</strong> и{" "}
                <strong>накопленную долю (%)</strong>.
              </>,
              <>
                Построй Pareto-диаграмму: опиши оси, тип каждого ряда данных
                (столбцы + линия).
              </>,
              <>
                По принципу 80/20 — на какие <strong>две причины</strong>{" "}
                направить усилия в первую очередь?
              </>,
              <>
                Предложи <strong>по одному конкретному действию</strong> для
                каждой из двух причин (формат: проблема → данные → ожидаемый
                результат).
              </>,
            ]}
          />
        </>
      );
    case "3":
      return (
        <>
          <PeCallout title="Исходные данные">
            Окно работы склада: <strong>8 ч/день</strong>. Средний Lead Time (от
            приёмки до отгрузки) — <strong>6 ч</strong>. Интенсивность
            поступления — <strong>R = 120 заказов/час</strong> (устойчивый
            режим).
            <br />
            <span className="mt-2 block font-mono text-xs">
              WIP ≈ R × Lead Time
            </span>
          </PeCallout>
          <PeStepList
            items={[
              <>
                Оцени средний <strong>WIP</strong> (заказы одновременно на
                складе).
              </>,
              <>
                После внедрения новой маршрутизации <strong>Lead Time</strong>{" "}
                снизился до <strong>4 ч</strong> при том же <strong>R</strong>.
                Какой стал <strong>WIP</strong>?
              </>,
              <>
                Нарисуй простую таблицу «до / после» с тремя строками: Lead
                Time, WIP, Загрузка зоны комплектации (высокая / средняя).
              </>,
              <>
                Объясни результат <strong>одним абзацем для стейкхолдера</strong>{" "}
                без жаргона.
              </>,
            ]}
          />
        </>
      );
    case "4":
      return (
        <>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Проект: запуск нового маршрута доставки в тестовом городе.
          </p>
          <PePre>{`Задача                         Длительность   Зависит от
──────────────────────────────────────────────────────────
A  Анализ AS-IS                   5 дней       —
B  Согласование с партнёром       3 дня        A
C  Настройка IT-маршрутизации     8 дней       A
D  Пилот с курьерами              4 дня        B, C
E  Ретро и отчёт                  2 дня        D`}</PePre>
          <CpmNetworkDiagram className="my-4" />
          <PeStepList
            items={[
              <>Нарисуй сеть (узлы = задачи, стрелки = зависимости).</>,
              <>
                Найди <strong>критический путь</strong> и{" "}
                <strong>минимальный срок проекта</strong> в днях.
              </>,
              <>
                Партнёр просит перенести старт B на 2 дня (B начинается не сразу
                после A, а +2). Изменится ли критический путь и итоговый срок?
              </>,
              <>
                Если C сократить на 3 дня за счёт овертайма IT-команды, каков
                новый срок? Стоит ли овертайм — обоснуй.
              </>,
            ]}
          />
        </>
      );
    case "5":
      return (
        <>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Текущий процесс «последней мили» от выезда курьера до закрытия
            доставки. Время — среднее.
          </p>
          <div className="my-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch">
            {[
              { t: "Загрузка авто", m: 15 },
              { t: "Переезд к точке", m: 22 },
              { t: "Поиск парковки", m: 8 },
              { t: "Звонок клиенту", m: 3 },
              { t: "Ожидание клиента", m: 12 },
              { t: "Передача и подпись", m: 2 },
              { t: "Фото подтверждение", m: 1 },
              { t: "Ввод в систему", m: 4 },
            ].map((s, i, arr) => (
              <div key={s.t} className="flex items-center gap-2 sm:gap-1">
                <div className="flex min-w-[140px] flex-1 flex-col rounded-lg border border-border bg-card px-3 py-2 shadow-sm sm:min-w-[120px] sm:flex-none">
                  <span className="text-xs font-medium text-foreground">
                    {s.t}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {s.m} мин
                  </span>
                </div>
                {i < arr.length - 1 ? (
                  <span
                    className="hidden text-muted-foreground sm:inline"
                    aria-hidden
                  >
                    →
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          <p className="text-sm font-medium text-foreground">
            Общее время одной доставки: <strong>67 мин</strong>
          </p>
          <PeStepList
            items={[
              <>
                Раздели шаги на <strong>ценностные</strong> (value-added) и{" "}
                <strong>потери</strong> (waste).
              </>,
              <>
                Посчитай <strong>Process Cycle Efficiency</strong> = время
                ценностных шагов / общее время.
              </>,
              <>
                Какие <strong>два шага</strong> — главные кандидаты на
                оптимизацию? Предложи конкретное решение для каждого.
              </>,
              <>
                Если оптимизация сократит «Поиск парковки» до 2 мин и
                «Ожидание клиента» до 5 мин, каков новый PCE?
              </>,
            ]}
          />
        </>
      );
    case "6":
      return (
        <>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Данные OTIF (On-Time In Full, %) по трём маршрутам за 4 недели.
            KPI компании: <strong>OTIF ≥ 90 %</strong>.
          </p>
          <OtifRoutesLineChart className="my-4" />
          <PeDataTable
            headers={["Маршрут", "Нед. 1", "Нед. 2", "Нед. 3", "Нед. 4"]}
            rows={[
              ["A", "91 %", "90 %", "89 %", "85 %"],
              ["B", "80 %", "75 %", "94 %", "70 %"],
              ["C", "95 %", "96 %", "95 %", "97 %"],
            ]}
          />
          <PeStepList
            items={[
              <>
                Какой маршрут стабильно выполняет KPI? Какой стабильно не
                выполняет?
              </>,
              <>
                Маршрут B: на неделе 3 резко вырос до 94 %, на неделе 4 упал до
                70 %. Сформулируй <strong>две гипотезы</strong>, что могло
                произойти.
              </>,
              <>
                Маршрут A: тренд нисходящий (91 → 85). Какие{" "}
                <strong>данные ты бы запросил</strong> для root cause analysis?
              </>,
              <>
                Подготовь <strong>3 буллета для еженедельного отчёта</strong>{" "}
                руководителю логистики (формат: факт → вывод → рекомендация).
              </>,
            ]}
          />
        </>
      );
    case "7":
      return (
        <>
          <p className="text-sm leading-relaxed text-muted-foreground">
            За неделю по маршруту:
          </p>
          <PeDataTable
            headers={["Категория", "Количество"]}
            rows={[
              ["Всего доставок", "10 000"],
              ["Доставлено в заявленное окно (on-time in full)", "8 650"],
              ["Доставлено вне окна, но в тот же день", "900"],
              ["Не доставлено в день обещания", "450"],
            ]}
          />
          <PeStepList
            items={[
              <>
                Посчитай <strong>долю on-time в окне</strong> (% от 10 000).
              </>,
              <>
                KPI: «≥ 90 % в окне». <strong>Выполнен ли он?</strong>
              </>,
              <>
                Предложи <strong>три метрики-предвестника</strong> (leading
                indicators), которые можно мерить до дня доставки.
              </>,
              <>
                Для каждого индикатора укажи:{" "}
                <strong>
                  что мерим → порог тревоги → действие
                </strong>{" "}
                (таблица).
              </>,
            ]}
          />
        </>
      );
    case "8":
      return (
        <>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Четыре инициативы process excellence с измеримыми параметрами.
            Правило:{" "}
            <strong>ROI = экономия за 6 мес / стоимость внедрения</strong>; при
            близких ROI — приоритет инициативе с большим NPS delta.
          </p>
          <PeDataTable
            headers={[
              "#",
              "Инициатива",
              "NPS Δ",
              "Дефекты",
              "Экономия PLN/мес",
              "FTE-нед.",
              "Стоимость PLN",
            ]}
            rows={[
              [
                1,
                "Чек-лист приёмки на APM",
                "+2",
                "−18 %",
                "12 000",
                3,
                "8 000",
              ],
              [
                2,
                "Единый дашборд статуса посылки",
                "+5",
                "−6 %",
                "5 000",
                10,
                "45 000",
              ],
              [
                3,
                "Обучение партнёров SOP возвратов",
                "+1",
                "−10 %",
                "8 000",
                6,
                "15 000",
              ],
              [
                4,
                "Оповещение при отклонении Lead Time",
                "+3",
                "−22 %",
                "20 000",
                5,
                "18 000",
              ],
            ]}
          />
          <PeStepList
            items={[
              <>Посчитай <strong>ROI</strong> для каждой инициативы.</>,
              <>
                Нарисуй таблицу-рейтинг (сортировка по ROI, NPS delta рядом).
              </>,
              <>
                Выбери <strong>топ-2 на квартал</strong> и для каждой — 3
                буллета: проблема → данные → ожидаемый результат.
              </>,
              <>
                Для инициативы с наибольшим Effort — главный{" "}
                <strong>риск</strong> и <strong>смягчение</strong>.
              </>,
            ]}
          />
        </>
      );
    case "9":
      return (
        <>
          <PeCallout title="Сценарий">
            Партнёр-перевозчик (30 % объёма) просит расширить окно доставки с
            10:00–18:00 на <strong>10:00–21:00</strong>. Угрожает повышением
            тарифа на <strong>8 %</strong>, если Allegro не согласится.
          </PeCallout>
          <PeDataTable
            headers={["Метрика", "Окно 10–18", "Прогноз 10–21"]}
            rows={[
              ["OTIF партнёра", "82 %", "~93 %"],
              ["Жалобы NPS на позднюю доставку", "1.2 %", "~3.8 %"],
              ["Стоимость на посылку", "4.20 PLN", "3.90 PLN"],
              ["Доля доставок после 20:00", "0 %", "~12 %"],
            ]}
          />
          <p className="text-sm text-muted-foreground">
            Опрос 500 клиентов: <strong>68 %</strong> считают доставку после
            20:00 неприемлемой.
          </p>
          <PeStepList
            items={[
              <>Сформулируй <strong>проблему</strong> одним предложением.</>,
              <>
                Какие <strong>три ключевых факта</strong> из данных поддерживают
                или опровергают предложение партнёра?
              </>,
              <>
                Предложи <strong>компромиссное решение</strong> (не «да» и не
                «нет»), опираясь на данные.
              </>,
              <>
                Оформи рекомендацию как письмо руководителю:{" "}
                <strong>Problem → Data → Recommendation</strong> (3 абзаца).
              </>,
            ]}
          />
        </>
      );
    default:
      return null;
  }
}
