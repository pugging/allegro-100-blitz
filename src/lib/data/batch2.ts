import type { BlitzSet } from "../types";

export const batch2: BlitzSet[] = [
  {
    id: 21,
    title: "Строки и функции Python",
    difficulty: "easy",
    categories: [
      {
        name: "Строки в Python",
        role: "automation",
        questions: [
          {
            id: "b21_q1",
            text: "Какой метод строки в Python используется для приведения всех символов к нижнему регистру?",
            options: {
              A: ".lower()",
              B: ".down()",
              C: ".casefold()",
              D: ".small()",
            },
            correct: "A",
            explanation:
              "Метод .lower() возвращает копию строки, где все символы приведены к нижнему регистру.",
            difficulty: "easy",
            role: "automation",
            topic: "python_strings",
          },
          {
            id: "b21_q2",
            text: "Что вернёт выражение 'Hello'[1:4] в Python?",
            options: {
              A: "Hel",
              B: "ell",
              C: "ello",
              D: "Hell",
            },
            correct: "B",
            explanation:
              "Срез [1:4] возвращает символы с индекса 1 по 3 включительно: 'ell'.",
            difficulty: "easy",
            role: "automation",
            topic: "python_strings",
          },
          {
            id: "b21_q3",
            text: "Какой метод используется для разделения строки на список подстрок?",
            options: {
              A: ".divide()",
              B: ".cut()",
              C: ".split()",
              D: ".separate()",
            },
            correct: "C",
            explanation:
              "Метод .split() разделяет строку по указанному разделителю и возвращает список подстрок.",
            difficulty: "easy",
            role: "automation",
            topic: "python_strings",
          },
        ],
      },
      {
        name: "Основы KPI",
        role: "controller",
        questions: [
          {
            id: "b21_q4",
            text: "Что означает аббревиатура EBITDA?",
            options: {
              A: "Earnings Before Interest, Taxes, Depreciation and Amortization",
              B: "Equity Based Income Through Direct Allocation",
              C: "Estimated Budget Including Total Direct Amounts",
              D: "Earnings By Internal Trading and Direct Assets",
            },
            correct: "A",
            explanation:
              "EBITDA — прибыль до вычета процентов, налогов, износа и амортизации.",
            difficulty: "easy",
            role: "controller",
            topic: "kpi_financial",
          },
          {
            id: "b21_q5",
            text: "Как рассчитывается маржа чистой прибыли?",
            options: {
              A: "Выручка / Чистая прибыль × 100%",
              B: "Чистая прибыль / Выручка × 100%",
              C: "Чистая прибыль / Активы × 100%",
              D: "Выручка / Активы × 100%",
            },
            correct: "B",
            explanation:
              "Маржа чистой прибыли = Чистая прибыль / Выручка × 100%. Показывает долю прибыли в выручке.",
            difficulty: "easy",
            role: "controller",
            topic: "kpi_financial",
          },
          {
            id: "b21_q6",
            text: "Что такое ROI?",
            options: {
              A: "Rate of Inflation",
              B: "Return on Investment",
              C: "Revenue of Income",
              D: "Ratio of Interest",
            },
            correct: "B",
            explanation:
              "ROI (Return on Investment) — показатель рентабельности инвестиций, отношение прибыли к вложениям.",
            difficulty: "easy",
            role: "controller",
            topic: "kpi_financial",
          },
        ],
      },
      {
        name: "Основы Kanban",
        role: "project",
        questions: [
          {
            id: "b21_q7",
            text: "Что такое WIP-лимит в Kanban?",
            options: {
              A: "Максимальный бюджет проекта",
              B: "Ограничение количества задач в работе одновременно",
              C: "Срок завершения спринта",
              D: "Количество участников команды",
            },
            correct: "B",
            explanation:
              "WIP-лимит (Work In Progress) ограничивает количество задач, которые могут находиться в работе одновременно.",
            difficulty: "easy",
            role: "project",
            topic: "kanban_basics",
          },
          {
            id: "b21_q8",
            text: "Какой основной визуальный инструмент используется в Kanban?",
            options: {
              A: "Диаграмма Ганта",
              B: "Kanban-доска",
              C: "Сетевой график",
              D: "Матрица RACI",
            },
            correct: "B",
            explanation:
              "Kanban-доска — основной инструмент визуализации потока работы с колонками статусов задач.",
            difficulty: "easy",
            role: "project",
            topic: "kanban_basics",
          },
          {
            id: "b21_q9",
            text: "Какие типичные колонки есть на Kanban-доске?",
            options: {
              A: "План, Бюджет, Отчёт",
              B: "To Do, In Progress, Done",
              C: "Sprint 1, Sprint 2, Sprint 3",
              D: "Идея, Тест, Релиз",
            },
            correct: "B",
            explanation:
              "Стандартные колонки Kanban-доски: To Do (Сделать), In Progress (В работе), Done (Готово).",
            difficulty: "easy",
            role: "project",
            topic: "kanban_basics",
          },
        ],
      },
    ],
  },
  {
    id: 22,
    title: "Функции Python и сводные таблицы",
    difficulty: "easy",
    categories: [
      {
        name: "Функции в Python",
        role: "automation",
        questions: [
          {
            id: "b22_q1",
            text: "Какое ключевое слово используется для определения функции в Python?",
            options: {
              A: "function",
              B: "func",
              C: "def",
              D: "define",
            },
            correct: "C",
            explanation:
              "В Python функции определяются с помощью ключевого слова def.",
            difficulty: "easy",
            role: "automation",
            topic: "python_functions",
          },
          {
            id: "b22_q2",
            text: "Что делает ключевое слово return в функции Python?",
            options: {
              A: "Печатает значение на экран",
              B: "Возвращает значение из функции вызывающему коду",
              C: "Удаляет функцию из памяти",
              D: "Перезапускает функцию",
            },
            correct: "B",
            explanation:
              "Ключевое слово return завершает выполнение функции и возвращает значение вызывающему коду.",
            difficulty: "easy",
            role: "automation",
            topic: "python_functions",
          },
          {
            id: "b22_q3",
            text: "Что такое lambda-функция в Python?",
            options: {
              A: "Функция для работы с файлами",
              B: "Анонимная однострочная функция",
              C: "Функция для сортировки списков",
              D: "Встроенная функция отладки",
            },
            correct: "B",
            explanation:
              "Lambda-функция — это анонимная функция, записываемая в одну строку: lambda args: expression.",
            difficulty: "easy",
            role: "automation",
            topic: "python_functions",
          },
        ],
      },
      {
        name: "Сводные таблицы",
        role: "controller",
        questions: [
          {
            id: "b22_q4",
            text: "Для чего используются сводные таблицы (Pivot Tables)?",
            options: {
              A: "Для написания макросов",
              B: "Для агрегации и группировки данных",
              C: "Для создания презентаций",
              D: "Для защиты файлов паролем",
            },
            correct: "B",
            explanation:
              "Сводные таблицы позволяют агрегировать, группировать и анализировать большие объёмы данных.",
            difficulty: "easy",
            role: "controller",
            topic: "pivot_tables",
          },
          {
            id: "b22_q5",
            text: "Какую операцию чаще всего выполняет сводная таблица с числовыми данными?",
            options: {
              A: "Форматирование ячеек",
              B: "Суммирование значений",
              C: "Удаление дубликатов",
              D: "Сортировку по алфавиту",
            },
            correct: "B",
            explanation:
              "По умолчанию сводные таблицы суммируют числовые значения при группировке данных.",
            difficulty: "easy",
            role: "controller",
            topic: "pivot_tables",
          },
          {
            id: "b22_q6",
            text: "Куда в сводной таблице помещается поле для группировки данных?",
            options: {
              A: "В область значений",
              B: "В область строк или столбцов",
              C: "В область фильтров",
              D: "В заголовок таблицы",
            },
            correct: "B",
            explanation:
              "Поля для группировки помещаются в области строк или столбцов сводной таблицы.",
            difficulty: "easy",
            role: "controller",
            topic: "pivot_tables",
          },
        ],
      },
      {
        name: "Scrum-фреймворк",
        role: "project",
        questions: [
          {
            id: "b22_q7",
            text: "Что такое спринт в Scrum?",
            options: {
              A: "Годовой отчёт о проекте",
              B: "Фиксированный временной интервал для выполнения работы",
              C: "Совещание с заказчиком",
              D: "Документ с требованиями",
            },
            correct: "B",
            explanation:
              "Спринт — фиксированный временной интервал (обычно 1-4 недели), в течение которого команда создаёт инкремент продукта.",
            difficulty: "easy",
            role: "project",
            topic: "scrum_framework",
          },
          {
            id: "b22_q8",
            text: "Что такое Product Backlog в Scrum?",
            options: {
              A: "Список выполненных задач",
              B: "Упорядоченный список всех требований к продукту",
              C: "Отчёт об ошибках",
              D: "План бюджета проекта",
            },
            correct: "B",
            explanation:
              "Product Backlog — упорядоченный по приоритету список всех требований, функций и улучшений продукта.",
            difficulty: "easy",
            role: "project",
            topic: "scrum_framework",
          },
          {
            id: "b22_q9",
            text: "Что измеряет velocity (скорость) команды в Scrum?",
            options: {
              A: "Скорость написания кода",
              B: "Объём работы, завершённой за спринт",
              C: "Количество ошибок за спринт",
              D: "Время ответа на запросы клиентов",
            },
            correct: "B",
            explanation:
              "Velocity показывает средний объём работы (в story points), который команда завершает за один спринт.",
            difficulty: "easy",
            role: "project",
            topic: "scrum_framework",
          },
        ],
      },
    ],
  },
  {
    id: 23,
    title: "Циклы Python и визуализация данных",
    difficulty: "easy",
    categories: [
      {
        name: "Циклы в Python",
        role: "automation",
        questions: [
          {
            id: "b23_q1",
            text: "Что вернёт range(5) в Python?",
            options: {
              A: "Числа от 1 до 5",
              B: "Числа от 0 до 4",
              C: "Числа от 0 до 5",
              D: "Числа от 1 до 4",
            },
            correct: "B",
            explanation:
              "range(5) генерирует последовательность чисел от 0 до 4 (не включая 5).",
            difficulty: "easy",
            role: "automation",
            topic: "python_loops",
          },
          {
            id: "b23_q2",
            text: "Какой цикл в Python выполняется, пока условие истинно?",
            options: {
              A: "for",
              B: "do...while",
              C: "while",
              D: "repeat",
            },
            correct: "C",
            explanation:
              "Цикл while выполняет блок кода, пока указанное условие остаётся истинным (True).",
            difficulty: "easy",
            role: "automation",
            topic: "python_loops",
          },
          {
            id: "b23_q3",
            text: "Что делает функция enumerate() при использовании с циклом for?",
            options: {
              A: "Сортирует элементы",
              B: "Возвращает индекс и значение каждого элемента",
              C: "Подсчитывает количество элементов",
              D: "Удаляет дубликаты",
            },
            correct: "B",
            explanation:
              "enumerate() возвращает пары (индекс, значение) для каждого элемента итерируемого объекта.",
            difficulty: "easy",
            role: "automation",
            topic: "python_loops",
          },
        ],
      },
      {
        name: "Визуализация данных",
        role: "controller",
        questions: [
          {
            id: "b23_q4",
            text: "Какой тип графика лучше всего подходит для отображения изменения значений во времени?",
            options: {
              A: "Круговая диаграмма",
              B: "Линейный график",
              C: "Гистограмма",
              D: "Точечная диаграмма",
            },
            correct: "B",
            explanation:
              "Линейный график (line chart) идеально подходит для отображения тенденций и изменений значений во времени.",
            difficulty: "easy",
            role: "controller",
            topic: "data_visualization",
          },
          {
            id: "b23_q5",
            text: "Для чего лучше всего использовать круговую диаграмму (pie chart)?",
            options: {
              A: "Для сравнения тенденций во времени",
              B: "Для отображения долей целого",
              C: "Для показа корреляции между переменными",
              D: "Для отображения распределения данных",
            },
            correct: "B",
            explanation:
              "Круговая диаграмма наглядно показывает доли частей от целого (например, структуру расходов).",
            difficulty: "easy",
            role: "controller",
            topic: "data_visualization",
          },
          {
            id: "b23_q6",
            text: "Какой тип графика подходит для сравнения нескольких категорий?",
            options: {
              A: "Линейный график",
              B: "Столбчатая диаграмма (bar chart)",
              C: "Точечная диаграмма (scatter plot)",
              D: "Пузырьковая диаграмма",
            },
            correct: "B",
            explanation:
              "Столбчатая диаграмма удобна для сравнения значений нескольких категорий между собой.",
            difficulty: "easy",
            role: "controller",
            topic: "data_visualization",
          },
        ],
      },
      {
        name: "Управление изменениями",
        role: "project",
        questions: [
          {
            id: "b23_q7",
            text: "Что описывает кривая принятия изменений (adoption curve)?",
            options: {
              A: "Стоимость внедрения изменений",
              B: "Скорость, с которой разные группы людей принимают изменения",
              C: "Технические этапы внедрения системы",
              D: "Количество ошибок при внедрении",
            },
            correct: "B",
            explanation:
              "Кривая принятия показывает, как разные группы (новаторы, раннее большинство и т.д.) принимают изменения с разной скоростью.",
            difficulty: "easy",
            role: "project",
            topic: "change_management_basics",
          },
          {
            id: "b23_q8",
            text: "Какая основная причина сопротивления сотрудников изменениям?",
            options: {
              A: "Желание получить повышение",
              B: "Страх неизвестности и потери привычного порядка",
              C: "Избыток свободного времени",
              D: "Слишком высокая зарплата",
            },
            correct: "B",
            explanation:
              "Страх неизвестности — одна из главных причин сопротивления изменениям в организациях.",
            difficulty: "easy",
            role: "project",
            topic: "change_management_basics",
          },
          {
            id: "b23_q9",
            text: "Что является ключевым фактором успешного управления изменениями?",
            options: {
              A: "Увеличение бюджета",
              B: "Коммуникация и вовлечение сотрудников",
              C: "Сокращение персонала",
              D: "Покупка нового оборудования",
            },
            correct: "B",
            explanation:
              "Открытая коммуникация и вовлечение сотрудников — ключевые факторы успешного управления изменениями.",
            difficulty: "easy",
            role: "project",
            topic: "change_management_basics",
          },
        ],
      },
    ],
  },
  {
    id: 24,
    title: "SQL JOIN и денежные потоки",
    difficulty: "easy",
    categories: [
      {
        name: "SQL JOIN запросы",
        role: "automation",
        questions: [
          {
            id: "b24_q1",
            text: "Что делает INNER JOIN в SQL?",
            options: {
              A: "Возвращает все строки из обеих таблиц",
              B: "Возвращает только совпадающие строки из обеих таблиц",
              C: "Возвращает все строки из левой таблицы",
              D: "Удаляет дубликаты из таблицы",
            },
            correct: "B",
            explanation:
              "INNER JOIN возвращает только те строки, которые имеют совпадающие значения в обеих таблицах.",
            difficulty: "easy",
            role: "automation",
            topic: "sql_joins",
          },
          {
            id: "b24_q2",
            text: "Что возвращает LEFT JOIN, если в правой таблице нет совпадений?",
            options: {
              A: "Ошибку",
              B: "Пустой результат",
              C: "Строку из левой таблицы с NULL для столбцов правой",
              D: "Только строки из правой таблицы",
            },
            correct: "C",
            explanation:
              "LEFT JOIN возвращает все строки из левой таблицы, а для несовпадающих строк правой таблицы подставляет NULL.",
            difficulty: "easy",
            role: "automation",
            topic: "sql_joins",
          },
          {
            id: "b24_q3",
            text: "По какому условию обычно связываются таблицы в JOIN?",
            options: {
              A: "По имени таблицы",
              B: "По общему столбцу (ключу)",
              C: "По количеству строк",
              D: "По дате создания таблицы",
            },
            correct: "B",
            explanation:
              "Таблицы в JOIN связываются по общему столбцу, обычно через первичный и внешний ключи.",
            difficulty: "easy",
            role: "automation",
            topic: "sql_joins",
          },
        ],
      },
      {
        name: "Основы денежных потоков",
        role: "controller",
        questions: [
          {
            id: "b24_q4",
            text: "Какие три вида деятельности отражаются в отчёте о движении денежных средств?",
            options: {
              A: "Производственная, маркетинговая, управленческая",
              B: "Операционная, инвестиционная, финансовая",
              C: "Плановая, фактическая, прогнозная",
              D: "Внутренняя, внешняя, смешанная",
            },
            correct: "B",
            explanation:
              "Отчёт о движении денежных средств включает операционную, инвестиционную и финансовую деятельность.",
            difficulty: "easy",
            role: "controller",
            topic: "cashflow_basics",
          },
          {
            id: "b24_q5",
            text: "К какому виду деятельности относится оплата от клиентов за товары?",
            options: {
              A: "Инвестиционная",
              B: "Финансовая",
              C: "Операционная",
              D: "Внебалансовая",
            },
            correct: "C",
            explanation:
              "Поступления от продажи товаров и услуг относятся к операционной деятельности.",
            difficulty: "easy",
            role: "controller",
            topic: "cashflow_basics",
          },
          {
            id: "b24_q6",
            text: "Покупка оборудования в отчёте о движении денежных средств относится к...",
            options: {
              A: "Операционной деятельности",
              B: "Финансовой деятельности",
              C: "Инвестиционной деятельности",
              D: "Прочей деятельности",
            },
            correct: "C",
            explanation:
              "Покупка основных средств и оборудования относится к инвестиционной деятельности.",
            difficulty: "easy",
            role: "controller",
            topic: "cashflow_basics",
          },
        ],
      },
      {
        name: "Управление качеством",
        role: "project",
        questions: [
          {
            id: "b24_q7",
            text: "В чём разница между контролем качества (QC) и обеспечением качества (QA)?",
            options: {
              A: "QC — это планирование, QA — это тестирование",
              B: "QC проверяет результат, QA обеспечивает правильность процесса",
              C: "Это одно и то же",
              D: "QA дешевле, чем QC",
            },
            correct: "B",
            explanation:
              "QC (Quality Control) — проверка готового продукта, QA (Quality Assurance) — обеспечение правильности процессов производства.",
            difficulty: "easy",
            role: "project",
            topic: "quality_management",
          },
          {
            id: "b24_q8",
            text: "Что является примером контроля качества (QC)?",
            options: {
              A: "Написание стандартов кодирования",
              B: "Тестирование готового продукта перед релизом",
              C: "Проведение тренингов для сотрудников",
              D: "Составление плана проекта",
            },
            correct: "B",
            explanation:
              "Тестирование готового продукта — типичный пример контроля качества (QC), т.к. проверяется результат.",
            difficulty: "easy",
            role: "project",
            topic: "quality_management",
          },
          {
            id: "b24_q9",
            text: "Что является примером обеспечения качества (QA)?",
            options: {
              A: "Проверка товара на складе",
              B: "Внедрение стандартов и лучших практик в процессы",
              C: "Подсчёт бракованных изделий",
              D: "Возврат товара клиенту",
            },
            correct: "B",
            explanation:
              "Внедрение стандартов и практик в процессы — это QA, направленное на предотвращение дефектов.",
            difficulty: "easy",
            role: "project",
            topic: "quality_management",
          },
        ],
      },
    ],
  },
  {
    id: 25,
    title: "UiPath Studio и отчётность",
    difficulty: "easy",
    categories: [
      {
        name: "UiPath Studio",
        role: "automation",
        questions: [
          {
            id: "b25_q1",
            text: "Что такое UiPath Studio?",
            options: {
              A: "Среда для разработки роботизированных процессов (RPA)",
              B: "Текстовый редактор кода",
              C: "Система управления базами данных",
              D: "Инструмент для создания веб-сайтов",
            },
            correct: "A",
            explanation:
              "UiPath Studio — среда разработки (IDE) для создания автоматизированных роботизированных процессов.",
            difficulty: "easy",
            role: "automation",
            topic: "uipath_studio",
          },
          {
            id: "b25_q2",
            text: "Что такое Activity (активити) в UiPath?",
            options: {
              A: "Отчёт о выполнении робота",
              B: "Базовый блок действий, выполняемый роботом",
              C: "Лицензия на использование UiPath",
              D: "База данных UiPath",
            },
            correct: "B",
            explanation:
              "Activity — элементарный блок действия в UiPath (например, Click, Type Into, Open Browser).",
            difficulty: "easy",
            role: "automation",
            topic: "uipath_studio",
          },
          {
            id: "b25_q3",
            text: "Какие типы переменных можно создавать в UiPath Studio?",
            options: {
              A: "Только текстовые",
              B: "String, Int32, Boolean, DataTable и другие",
              C: "Только числовые",
              D: "Только Boolean",
            },
            correct: "B",
            explanation:
              "UiPath поддерживает множество типов переменных: String, Int32, Boolean, DataTable, DateTime и др.",
            difficulty: "easy",
            role: "automation",
            topic: "uipath_studio",
          },
        ],
      },
      {
        name: "Основы отчётности",
        role: "controller",
        questions: [
          {
            id: "b25_q4",
            text: "Что такое monthly close (закрытие месяца)?",
            options: {
              A: "Увольнение сотрудников в конце месяца",
              B: "Процесс завершения и сверки финансовых данных за месяц",
              C: "Закрытие офиса на выходные",
              D: "Обновление программного обеспечения",
            },
            correct: "B",
            explanation:
              "Monthly close — процесс закрытия бухгалтерских книг и сверки всех финансовых данных за отчётный месяц.",
            difficulty: "easy",
            role: "controller",
            topic: "reporting_basics",
          },
          {
            id: "b25_q5",
            text: "Какова основная цель финансовой отчётности?",
            options: {
              A: "Увеличение прибыли компании",
              B: "Предоставление достоверной информации о финансовом состоянии",
              C: "Уменьшение налогов",
              D: "Привлечение новых сотрудников",
            },
            correct: "B",
            explanation:
              "Финансовая отчётность предоставляет достоверную информацию о финансовом положении компании заинтересованным сторонам.",
            difficulty: "easy",
            role: "controller",
            topic: "reporting_basics",
          },
          {
            id: "b25_q6",
            text: "Что такое reporting cycle (цикл отчётности)?",
            options: {
              A: "Период между наймом и увольнением",
              B: "Регулярная периодичность подготовки и подачи отчётов",
              C: "Цикл разработки программного обеспечения",
              D: "Период между двумя аудитами",
            },
            correct: "B",
            explanation:
              "Цикл отчётности — регулярная периодичность (ежемесячная, квартальная, годовая) подготовки финансовых отчётов.",
            difficulty: "easy",
            role: "controller",
            topic: "reporting_basics",
          },
        ],
      },
      {
        name: "Коммуникации в проекте",
        role: "project",
        questions: [
          {
            id: "b25_q7",
            text: "Что такое status report (статусный отчёт) в проекте?",
            options: {
              A: "Документ об увольнении сотрудника",
              B: "Регулярный отчёт о текущем состоянии проекта",
              C: "План закупок оборудования",
              D: "Контракт с подрядчиком",
            },
            correct: "B",
            explanation:
              "Статусный отчёт — регулярный документ, информирующий заинтересованные стороны о прогрессе, рисках и проблемах проекта.",
            difficulty: "easy",
            role: "project",
            topic: "communication_planning",
          },
          {
            id: "b25_q8",
            text: "Какой тип встречи используется для ежедневной синхронизации команды?",
            options: {
              A: "Ретроспектива",
              B: "Daily standup (ежедневная стендап-встреча)",
              C: "Квартальный обзор",
              D: "Стратегическая сессия",
            },
            correct: "B",
            explanation:
              "Daily standup — короткая ежедневная встреча для синхронизации команды по текущим задачам.",
            difficulty: "easy",
            role: "project",
            topic: "communication_planning",
          },
          {
            id: "b25_q9",
            text: "Что является целью плана коммуникаций в проекте?",
            options: {
              A: "Определить бюджет проекта",
              B: "Определить кто, что, когда и как получает информацию о проекте",
              C: "Составить график отпусков",
              D: "Написать техническое задание",
            },
            correct: "B",
            explanation:
              "План коммуникаций определяет, кто и какую информацию получает, в каком формате и с какой периодичностью.",
            difficulty: "easy",
            role: "project",
            topic: "communication_planning",
          },
        ],
      },
    ],
  },
  {
    id: 26,
    title: "Селекторы UiPath и GDPR",
    difficulty: "easy",
    categories: [
      {
        name: "Селекторы UiPath",
        role: "automation",
        questions: [
          {
            id: "b26_q1",
            text: "Что такое селектор (selector) в UiPath?",
            options: {
              A: "Тип переменной",
              B: "XML-описание элемента пользовательского интерфейса",
              C: "Шаблон электронного письма",
              D: "Тип лицензии",
            },
            correct: "B",
            explanation:
              "Селектор в UiPath — XML-строка, описывающая расположение и атрибуты элемента UI для взаимодействия.",
            difficulty: "easy",
            role: "automation",
            topic: "uipath_selectors",
          },
          {
            id: "b26_q2",
            text: "Зачем нужен динамический селектор в UiPath?",
            options: {
              A: "Для ускорения работы робота",
              B: "Для взаимодействия с элементами, атрибуты которых меняются",
              C: "Для создания новых окон приложения",
              D: "Для отправки электронной почты",
            },
            correct: "B",
            explanation:
              "Динамические селекторы используют переменные вместо фиксированных значений для работы с изменяющимися элементами UI.",
            difficulty: "easy",
            role: "automation",
            topic: "uipath_selectors",
          },
          {
            id: "b26_q3",
            text: "Какой инструмент UiPath помогает исследовать и редактировать селекторы?",
            options: {
              A: "Data Manager",
              B: "UI Explorer",
              C: "Output Panel",
              D: "Package Manager",
            },
            correct: "B",
            explanation:
              "UI Explorer — инструмент UiPath для просмотра, анализа и редактирования селекторов элементов интерфейса.",
            difficulty: "easy",
            role: "automation",
            topic: "uipath_selectors",
          },
        ],
      },
      {
        name: "Основы GDPR",
        role: "general",
        questions: [
          {
            id: "b26_q4",
            text: "Что такое GDPR?",
            options: {
              A: "Стандарт программирования",
              B: "Общий регламент защиты персональных данных ЕС",
              C: "Система управления проектами",
              D: "Протокол передачи данных",
            },
            correct: "B",
            explanation:
              "GDPR (General Data Protection Regulation) — регламент ЕС, устанавливающий правила обработки персональных данных.",
            difficulty: "easy",
            role: "general",
            topic: "gdpr_basics",
          },
          {
            id: "b26_q5",
            text: "Что относится к персональным данным по GDPR?",
            options: {
              A: "Только номер паспорта",
              B: "Любая информация, позволяющая идентифицировать человека",
              C: "Только финансовые данные",
              D: "Только медицинские записи",
            },
            correct: "B",
            explanation:
              "Персональные данные — любая информация, относящаяся к идентифицированному или идентифицируемому лицу (имя, email, IP-адрес и т.д.).",
            difficulty: "easy",
            role: "general",
            topic: "gdpr_basics",
          },
          {
            id: "b26_q6",
            text: "Какое право даёт GDPR субъекту данных в отношении его персональных данных?",
            options: {
              A: "Право продавать свои данные",
              B: "Право на доступ, исправление и удаление своих данных",
              C: "Право изменять данные других людей",
              D: "Право на бесплатный интернет",
            },
            correct: "B",
            explanation:
              "GDPR предоставляет субъектам данных права на доступ, исправление, удаление и перенос своих персональных данных.",
            difficulty: "easy",
            role: "general",
            topic: "gdpr_basics",
          },
        ],
      },
      {
        name: "Улучшение процессов",
        role: "project",
        questions: [
          {
            id: "b26_q7",
            text: "Что такое Kaizen?",
            options: {
              A: "Японская философия непрерывного улучшения",
              B: "Инструмент для управления бюджетом",
              C: "Методология тестирования ПО",
              D: "Стандарт бухгалтерского учёта",
            },
            correct: "A",
            explanation:
              "Kaizen — японская философия, основанная на идее непрерывного постепенного улучшения процессов.",
            difficulty: "easy",
            role: "project",
            topic: "process_improvement",
          },
          {
            id: "b26_q8",
            text: "Что является основной идеей непрерывного улучшения (Continuous Improvement)?",
            options: {
              A: "Большие редкие реформы",
              B: "Постоянные небольшие улучшения процессов",
              C: "Замена всех сотрудников",
              D: "Покупка нового оборудования каждый год",
            },
            correct: "B",
            explanation:
              "Непрерывное улучшение — подход, при котором организация постоянно вносит небольшие улучшения в свои процессы.",
            difficulty: "easy",
            role: "project",
            topic: "process_improvement",
          },
          {
            id: "b26_q9",
            text: "Какой цикл описывает процесс непрерывного улучшения?",
            options: {
              A: "SWOT",
              B: "PDCA (Plan-Do-Check-Act)",
              C: "PEST",
              D: "BCG",
            },
            correct: "B",
            explanation:
              "Цикл PDCA (Планируй-Делай-Проверяй-Действуй) — базовый инструмент непрерывного улучшения процессов.",
            difficulty: "easy",
            role: "project",
            topic: "process_improvement",
          },
        ],
      },
    ],
  },
  {
    id: 27,
    title: "Git и бизнес-партнёрство",
    difficulty: "easy",
    categories: [
      {
        name: "Контроль версий Git",
        role: "automation",
        questions: [
          {
            id: "b27_q1",
            text: "Для чего используется система контроля версий Git?",
            options: {
              A: "Для создания веб-сайтов",
              B: "Для отслеживания изменений в коде и совместной работы",
              C: "Для управления базами данных",
              D: "Для тестирования программ",
            },
            correct: "B",
            explanation:
              "Git — система контроля версий для отслеживания изменений в файлах и координации работы нескольких разработчиков.",
            difficulty: "easy",
            role: "automation",
            topic: "version_control",
          },
          {
            id: "b27_q2",
            text: "Что такое Pull Request (PR)?",
            options: {
              A: "Запрос на удаление репозитория",
              B: "Запрос на проверку и слияние изменений в основную ветку",
              C: "Запрос на скачивание файла",
              D: "Запрос на создание нового проекта",
            },
            correct: "B",
            explanation:
              "Pull Request — запрос разработчика на ревью и слияние его изменений из одной ветки в другую.",
            difficulty: "easy",
            role: "automation",
            topic: "version_control",
          },
          {
            id: "b27_q3",
            text: "Что делает команда git commit?",
            options: {
              A: "Удаляет файлы из репозитория",
              B: "Сохраняет текущие изменения в историю репозитория",
              C: "Скачивает изменения с сервера",
              D: "Создаёт новую ветку",
            },
            correct: "B",
            explanation:
              "git commit сохраняет подготовленные (staged) изменения в локальную историю репозитория с описанием.",
            difficulty: "easy",
            role: "automation",
            topic: "version_control",
          },
        ],
      },
      {
        name: "Бизнес-партнёрство",
        role: "controller",
        questions: [
          {
            id: "b27_q4",
            text: "Что означает концепция «бизнес-партнёрства» в финансах?",
            options: {
              A: "Создание совместного предприятия",
              B: "Роль финансиста как стратегического советника бизнеса",
              C: "Партнёрская программа скидок",
              D: "Аутсорсинг бухгалтерии",
            },
            correct: "B",
            explanation:
              "Бизнес-партнёрство — концепция, где финансовый специалист выступает стратегическим советником, помогая бизнесу принимать решения.",
            difficulty: "easy",
            role: "controller",
            topic: "business_partnering",
          },
          {
            id: "b27_q5",
            text: "Какой навык наиболее важен для финансового бизнес-партнёра?",
            options: {
              A: "Программирование на C++",
              B: "Умение переводить финансовые данные в бизнес-рекомендации",
              C: "Знание трудового права",
              D: "Навыки графического дизайна",
            },
            correct: "B",
            explanation:
              "Бизнес-партнёр должен уметь анализировать данные и переводить их в понятные рекомендации для принятия бизнес-решений.",
            difficulty: "easy",
            role: "controller",
            topic: "business_partnering",
          },
          {
            id: "b27_q6",
            text: "С кем в первую очередь взаимодействует финансовый бизнес-партнёр?",
            options: {
              A: "Только с бухгалтерией",
              B: "С руководителями бизнес-подразделений (стейкхолдерами)",
              C: "Только с внешними аудиторами",
              D: "Только с IT-отделом",
            },
            correct: "B",
            explanation:
              "Финансовый бизнес-партнёр работает непосредственно с руководителями подразделений, поддерживая их решения данными.",
            difficulty: "easy",
            role: "controller",
            topic: "business_partnering",
          },
        ],
      },
      {
        name: "Основы ИИ",
        role: "general",
        questions: [
          {
            id: "b27_q7",
            text: "Что такое искусственный интеллект (ИИ)?",
            options: {
              A: "Программа для создания веб-сайтов",
              B: "Способность компьютерных систем выполнять задачи, требующие человеческого интеллекта",
              C: "Операционная система",
              D: "Социальная сеть",
            },
            correct: "B",
            explanation:
              "ИИ — область информатики, создающая системы, способные выполнять задачи, обычно требующие человеческого интеллекта.",
            difficulty: "easy",
            role: "general",
            topic: "ai_basics",
          },
          {
            id: "b27_q8",
            text: "Чем Machine Learning (ML) отличается от Deep Learning (DL)?",
            options: {
              A: "ML и DL — это одно и то же",
              B: "DL — подмножество ML, использующее нейронные сети с множеством слоёв",
              C: "ML использует нейронные сети, а DL — нет",
              D: "DL работает только с текстом",
            },
            correct: "B",
            explanation:
              "Deep Learning — подмножество Machine Learning, использующее глубокие нейронные сети с множеством скрытых слоёв.",
            difficulty: "easy",
            role: "general",
            topic: "ai_basics",
          },
          {
            id: "b27_q9",
            text: "Какой пример использования ИИ в e-commerce?",
            options: {
              A: "Ручная упаковка товаров",
              B: "Персональные рекомендации товаров на основе поведения покупателя",
              C: "Печать ценников",
              D: "Уборка склада",
            },
            correct: "B",
            explanation:
              "Системы рекомендаций, анализирующие поведение покупателей, — один из ключевых примеров ИИ в e-commerce.",
            difficulty: "easy",
            role: "general",
            topic: "ai_basics",
          },
        ],
      },
    ],
  },
  {
    id: 28,
    title: "Командная строка и логистика",
    difficulty: "easy",
    categories: [
      {
        name: "Основы командной строки",
        role: "automation",
        questions: [
          {
            id: "b28_q1",
            text: "Какая команда используется для перехода в другую директорию в терминале?",
            options: {
              A: "mv",
              B: "cd",
              C: "cp",
              D: "ls",
            },
            correct: "B",
            explanation:
              "Команда cd (change directory) используется для перехода между директориями в терминале.",
            difficulty: "easy",
            role: "automation",
            topic: "cli_basics",
          },
          {
            id: "b28_q2",
            text: "Какая команда выводит список файлов в текущей директории?",
            options: {
              A: "dir (Windows) / ls (Unix)",
              B: "show",
              C: "list",
              D: "files",
            },
            correct: "A",
            explanation:
              "Команда dir (Windows) или ls (Linux/macOS) выводит содержимое текущей директории.",
            difficulty: "easy",
            role: "automation",
            topic: "cli_basics",
          },
          {
            id: "b28_q3",
            text: "Что означает путь '..' в командной строке?",
            options: {
              A: "Текущая директория",
              B: "Родительская (верхняя) директория",
              C: "Домашняя директория",
              D: "Корневая директория",
            },
            correct: "B",
            explanation:
              "'..' обозначает родительскую директорию — на один уровень выше текущей.",
            difficulty: "easy",
            role: "automation",
            topic: "cli_basics",
          },
        ],
      },
      {
        name: "Анализ отклонений",
        role: "controller",
        questions: [
          {
            id: "b28_q4",
            text: "Что такое variance analysis (анализ отклонений)?",
            options: {
              A: "Анализ конкурентов",
              B: "Сравнение плановых (бюджетных) и фактических показателей",
              C: "Анализ рынка труда",
              D: "Проверка программного кода",
            },
            correct: "B",
            explanation:
              "Анализ отклонений — сравнение запланированных (бюджетных) показателей с фактическими для выявления отклонений.",
            difficulty: "easy",
            role: "controller",
            topic: "variance_analysis",
          },
          {
            id: "b28_q5",
            text: "Если фактические расходы выше бюджетных, это называется...",
            options: {
              A: "Благоприятное отклонение",
              B: "Неблагоприятное (отрицательное) отклонение",
              C: "Нулевое отклонение",
              D: "Стандартное отклонение",
            },
            correct: "B",
            explanation:
              "Превышение фактических расходов над бюджетом — неблагоприятное отклонение, указывающее на перерасход.",
            difficulty: "easy",
            role: "controller",
            topic: "variance_analysis",
          },
          {
            id: "b28_q6",
            text: "Зачем проводится анализ отклонений?",
            options: {
              A: "Для развлечения сотрудников",
              B: "Для выявления причин расхождений и принятия корректирующих мер",
              C: "Для увеличения количества отчётов",
              D: "Для сокращения штата",
            },
            correct: "B",
            explanation:
              "Анализ отклонений помогает выявить причины расхождений между планом и фактом и принять меры для их устранения.",
            difficulty: "easy",
            role: "controller",
            topic: "variance_analysis",
          },
        ],
      },
      {
        name: "Логистика и доставка",
        role: "project",
        questions: [
          {
            id: "b28_q7",
            text: "Что такое last mile delivery (доставка последней мили)?",
            options: {
              A: "Доставка товара от производителя на склад",
              B: "Финальный этап доставки от распределительного центра до конечного клиента",
              C: "Транспортировка между городами",
              D: "Возврат товара на склад",
            },
            correct: "B",
            explanation:
              "Last mile delivery — финальный этап логистической цепочки: доставка от ближайшего хаба до двери клиента.",
            difficulty: "easy",
            role: "project",
            topic: "logistics_delivery",
          },
          {
            id: "b28_q8",
            text: "Что такое APM (Automatic Parcel Machine) в контексте e-commerce?",
            options: {
              A: "Система управления проектами",
              B: "Автоматический почтомат (пункт выдачи посылок)",
              C: "Метод оплаты онлайн",
              D: "Программа лояльности",
            },
            correct: "B",
            explanation:
              "APM (Automatic Parcel Machine) — автоматический почтомат, позволяющий получать и отправлять посылки 24/7.",
            difficulty: "easy",
            role: "project",
            topic: "logistics_delivery",
          },
          {
            id: "b28_q9",
            text: "Какое преимущество даёт самовывоз из пункта выдачи по сравнению с курьерской доставкой?",
            options: {
              A: "Товар доставляется быстрее",
              B: "Ниже стоимость доставки и удобный график получения",
              C: "Больший выбор товаров",
              D: "Автоматический возврат",
            },
            correct: "B",
            explanation:
              "Самовывоз обычно дешевле курьерской доставки и позволяет забрать посылку в удобное время.",
            difficulty: "easy",
            role: "project",
            topic: "logistics_delivery",
          },
        ],
      },
    ],
  },
  {
    id: 29,
    title: "Сети и e-commerce в Польше",
    difficulty: "easy",
    categories: [
      {
        name: "Основы сетей",
        role: "automation",
        questions: [
          {
            id: "b29_q1",
            text: "Что такое IP-адрес?",
            options: {
              A: "Название веб-сайта",
              B: "Уникальный числовой адрес устройства в сети",
              C: "Пароль для входа в систему",
              D: "Тип файла",
            },
            correct: "B",
            explanation:
              "IP-адрес — уникальный числовой идентификатор устройства в компьютерной сети (например, 192.168.1.1).",
            difficulty: "easy",
            role: "automation",
            topic: "networking_basics",
          },
          {
            id: "b29_q2",
            text: "Что делает DNS (Domain Name System)?",
            options: {
              A: "Защищает компьютер от вирусов",
              B: "Переводит доменные имена в IP-адреса",
              C: "Шифрует электронную почту",
              D: "Управляет базами данных",
            },
            correct: "B",
            explanation:
              "DNS преобразует понятные человеку доменные имена (google.com) в IP-адреса, понятные компьютерам.",
            difficulty: "easy",
            role: "automation",
            topic: "networking_basics",
          },
          {
            id: "b29_q3",
            text: "Что такое порт в контексте сетевых соединений?",
            options: {
              A: "Физический разъём на компьютере",
              B: "Числовой идентификатор для конкретного сервиса на устройстве",
              C: "Тип интернет-кабеля",
              D: "Скорость интернет-соединения",
            },
            correct: "B",
            explanation:
              "Сетевой порт — числовой идентификатор (0-65535), определяющий конкретный сервис или приложение на устройстве.",
            difficulty: "easy",
            role: "automation",
            topic: "networking_basics",
          },
        ],
      },
      {
        name: "E-commerce в Польше",
        role: "general",
        questions: [
          {
            id: "b29_q4",
            text: "Какая компания является крупнейшей платформой e-commerce в Польше?",
            options: {
              A: "Amazon",
              B: "Allegro",
              C: "eBay",
              D: "Shopify",
            },
            correct: "B",
            explanation:
              "Allegro — крупнейшая платформа электронной торговли в Польше и одна из крупнейших в Центральной Европе.",
            difficulty: "easy",
            role: "general",
            topic: "ecommerce_poland",
          },
          {
            id: "b29_q5",
            text: "Какой популярный метод онлайн-оплаты широко используется в Польше?",
            options: {
              A: "PayPal",
              B: "BLIK",
              C: "Bitcoin",
              D: "Western Union",
            },
            correct: "B",
            explanation:
              "BLIK — популярная польская платёжная система, позволяющая совершать мгновенные платежи через мобильный банкинг.",
            difficulty: "easy",
            role: "general",
            topic: "ecommerce_poland",
          },
          {
            id: "b29_q6",
            text: "Что такое Allegro Smart! в контексте польского e-commerce?",
            options: {
              A: "Программа обучения программированию",
              B: "Программа бесплатной доставки для подписчиков",
              C: "Антивирусная программа",
              D: "Система управления складом",
            },
            correct: "B",
            explanation:
              "Allegro Smart! — подписка, дающая бесплатную доставку при покупках на определённую сумму.",
            difficulty: "easy",
            role: "general",
            topic: "ecommerce_poland",
          },
        ],
      },
      {
        name: "Навыки на рабочем месте",
        role: "general",
        questions: [
          {
            id: "b29_q7",
            text: "Что такое матрица Эйзенхауэра?",
            options: {
              A: "Метод шифрования данных",
              B: "Инструмент приоритизации задач по срочности и важности",
              C: "Финансовый отчёт",
              D: "Тип диаграммы",
            },
            correct: "B",
            explanation:
              "Матрица Эйзенхауэра делит задачи на 4 квадранта по срочности и важности для эффективной приоритизации.",
            difficulty: "easy",
            role: "general",
            topic: "workplace_skills",
          },
          {
            id: "b29_q8",
            text: "Какой принцип управления временем гласит, что 80% результатов приходят от 20% усилий?",
            options: {
              A: "Закон Мёрфи",
              B: "Принцип Парето",
              C: "Правило трёх",
              D: "Метод Помодоро",
            },
            correct: "B",
            explanation:
              "Принцип Парето (правило 80/20) утверждает, что 80% результатов обеспечивается 20% усилий.",
            difficulty: "easy",
            role: "general",
            topic: "workplace_skills",
          },
          {
            id: "b29_q9",
            text: "Что такое метод Помодоро (Pomodoro)?",
            options: {
              A: "Итальянский рецепт",
              B: "Техника управления временем с интервалами работы по 25 минут",
              C: "Метод приготовления отчётов",
              D: "Способ организации файлов",
            },
            correct: "B",
            explanation:
              "Метод Помодоро — техника тайм-менеджмента с рабочими интервалами по 25 минут, разделёнными короткими перерывами.",
            difficulty: "easy",
            role: "general",
            topic: "workplace_skills",
          },
        ],
      },
    ],
  },
  {
    id: 30,
    title: "Docker и форматирование строк",
    difficulty: "easy",
    categories: [
      {
        name: "Основы Docker",
        role: "automation",
        questions: [
          {
            id: "b30_q1",
            text: "Чем контейнер Docker отличается от виртуальной машины?",
            options: {
              A: "Контейнер содержит полную ОС, а ВМ — нет",
              B: "Контейнер разделяет ядро ОС хоста и легче, чем ВМ",
              C: "Контейнер и ВМ — одно и то же",
              D: "ВМ быстрее контейнера",
            },
            correct: "B",
            explanation:
              "Контейнеры Docker используют ядро хостовой ОС, что делает их легче и быстрее виртуальных машин с полной ОС.",
            difficulty: "easy",
            role: "automation",
            topic: "docker_basics",
          },
          {
            id: "b30_q2",
            text: "Что такое Docker image (образ Docker)?",
            options: {
              A: "Запущенный экземпляр контейнера",
              B: "Шаблон (снимок) для создания контейнеров",
              C: "Физический сервер",
              D: "Тип базы данных",
            },
            correct: "B",
            explanation:
              "Docker image — неизменяемый шаблон (blueprint), на основе которого создаются и запускаются контейнеры.",
            difficulty: "easy",
            role: "automation",
            topic: "docker_basics",
          },
          {
            id: "b30_q3",
            text: "Какой файл описывает инструкции для сборки Docker-образа?",
            options: {
              A: "docker-compose.yml",
              B: "Dockerfile",
              C: "package.json",
              D: "config.xml",
            },
            correct: "B",
            explanation:
              "Dockerfile — текстовый файл с инструкциями (FROM, RUN, COPY и др.) для пошаговой сборки Docker-образа.",
            difficulty: "easy",
            role: "automation",
            topic: "docker_basics",
          },
        ],
      },
      {
        name: "Форматирование строк Python",
        role: "automation",
        questions: [
          {
            id: "b30_q4",
            text: "Что такое f-строки (f-strings) в Python?",
            options: {
              A: "Строки, начинающиеся с буквы F",
              B: "Форматированные строковые литералы с вставкой выражений в {}",
              C: "Функции для работы с файлами",
              D: "Строки, содержащие только числа",
            },
            correct: "B",
            explanation:
              "F-строки (f'...{expression}...') позволяют вставлять значения переменных и выражений прямо в строку.",
            difficulty: "easy",
            role: "automation",
            topic: "python_strings",
          },
          {
            id: "b30_q5",
            text: "Что вернёт метод 'hello world'.upper() в Python?",
            options: {
              A: "Hello World",
              B: "HELLO WORLD",
              C: "hello world",
              D: "Hello world",
            },
            correct: "B",
            explanation:
              "Метод .upper() возвращает копию строки, где все символы приведены к верхнему регистру.",
            difficulty: "easy",
            role: "automation",
            topic: "python_strings",
          },
          {
            id: "b30_q6",
            text: "Какой метод удаляет пробелы в начале и конце строки в Python?",
            options: {
              A: ".clean()",
              B: ".strip()",
              C: ".trim()",
              D: ".remove()",
            },
            correct: "B",
            explanation:
              "Метод .strip() удаляет пробелы (и другие указанные символы) с обоих концов строки.",
            difficulty: "easy",
            role: "automation",
            topic: "python_strings",
          },
        ],
      },
      {
        name: "Польский e-commerce рынок",
        role: "general",
        questions: [
          {
            id: "b30_q7",
            text: "Какой способ оплаты P24 (Przelewy24) широко используется в Польше?",
            options: {
              A: "Оплата криптовалютой",
              B: "Система быстрых банковских переводов онлайн",
              C: "Оплата наличными при доставке",
              D: "Подарочные карты",
            },
            correct: "B",
            explanation:
              "Przelewy24 (P24) — популярный польский платёжный агрегатор для быстрых банковских переводов в интернете.",
            difficulty: "easy",
            role: "general",
            topic: "ecommerce_poland",
          },
          {
            id: "b30_q8",
            text: "Что такое marketplace (маркетплейс) модель в e-commerce?",
            options: {
              A: "Магазин с одним продавцом",
              B: "Платформа, объединяющая множество продавцов и покупателей",
              C: "Физический рынок",
              D: "Система доставки",
            },
            correct: "B",
            explanation:
              "Маркетплейс — онлайн-платформа, объединяющая множество продавцов, которые предлагают товары покупателям (пример: Allegro).",
            difficulty: "easy",
            role: "general",
            topic: "ecommerce_poland",
          },
          {
            id: "b30_q9",
            text: "Какой тренд наблюдается в польском e-commerce в последние годы?",
            options: {
              A: "Снижение онлайн-продаж",
              B: "Рост мобильной торговли (m-commerce) и автоматизации доставки",
              C: "Отказ от электронных платежей",
              D: "Переход только на наличные расчёты",
            },
            correct: "B",
            explanation:
              "В Польше активно растёт мобильная торговля и расширяется сеть автоматических пунктов выдачи (APM).",
            difficulty: "easy",
            role: "general",
            topic: "ecommerce_poland",
          },
        ],
      },
    ],
  },
  {
    id: 31,
    title: "Аргументы функций и Scrum-роли",
    difficulty: "easy",
    categories: [
      {
        name: "Аргументы функций Python",
        role: "automation",
        questions: [
          {
            id: "b31_q1",
            text: "Что такое аргумент по умолчанию в Python-функции?",
            options: {
              A: "Аргумент, который нельзя изменить",
              B: "Значение параметра, используемое, если аргумент не передан",
              C: "Первый аргумент функции",
              D: "Аргумент, который всегда равен None",
            },
            correct: "B",
            explanation:
              "Аргумент по умолчанию (def f(x=10)) — значение, которое используется, если при вызове функции аргумент не указан.",
            difficulty: "easy",
            role: "automation",
            topic: "python_functions",
          },
          {
            id: "b31_q2",
            text: "Что означает *args в определении функции Python?",
            options: {
              A: "Обязательный аргумент",
              B: "Принимает произвольное количество позиционных аргументов",
              C: "Аргумент-ключевое слово",
              D: "Глобальная переменная",
            },
            correct: "B",
            explanation:
              "*args позволяет функции принимать произвольное количество позиционных аргументов в виде кортежа.",
            difficulty: "easy",
            role: "automation",
            topic: "python_functions",
          },
          {
            id: "b31_q3",
            text: "Что вернёт функция Python, если в ней нет оператора return?",
            options: {
              A: "0",
              B: "None",
              C: "Ошибку",
              D: "Пустую строку",
            },
            correct: "B",
            explanation:
              "Если функция не содержит return или return без значения, она по умолчанию возвращает None.",
            difficulty: "easy",
            role: "automation",
            topic: "python_functions",
          },
        ],
      },
      {
        name: "Роли в Scrum",
        role: "project",
        questions: [
          {
            id: "b31_q4",
            text: "Кто отвечает за приоритизацию Product Backlog в Scrum?",
            options: {
              A: "Scrum Master",
              B: "Product Owner",
              C: "Команда разработки",
              D: "Менеджер проекта",
            },
            correct: "B",
            explanation:
              "Product Owner — единственный человек, ответственный за управление и приоритизацию Product Backlog.",
            difficulty: "easy",
            role: "project",
            topic: "scrum_framework",
          },
          {
            id: "b31_q5",
            text: "Какова основная роль Scrum Master?",
            options: {
              A: "Писать код",
              B: "Помогать команде следовать Scrum и устранять препятствия",
              C: "Утверждать бюджет",
              D: "Общаться с клиентами",
            },
            correct: "B",
            explanation:
              "Scrum Master — служебный лидер, помогающий команде следовать Scrum-практикам и устраняющий препятствия в работе.",
            difficulty: "easy",
            role: "project",
            topic: "scrum_framework",
          },
          {
            id: "b31_q6",
            text: "Что такое Sprint Review в Scrum?",
            options: {
              A: "Совещание по планированию бюджета",
              B: "Встреча для демонстрации результатов спринта заинтересованным лицам",
              C: "Ежедневная стендап-встреча",
              D: "Анализ причин провала проекта",
            },
            correct: "B",
            explanation:
              "Sprint Review — встреча в конце спринта, на которой команда демонстрирует созданный инкремент продукта.",
            difficulty: "easy",
            role: "project",
            topic: "scrum_framework",
          },
        ],
      },
      {
        name: "GDPR: согласие и обработка",
        role: "general",
        questions: [
          {
            id: "b31_q7",
            text: "Что такое «согласие» (consent) в контексте GDPR?",
            options: {
              A: "Автоматическое разрешение на обработку данных",
              B: "Добровольное, информированное и однозначное согласие субъекта на обработку его данных",
              C: "Подпись на трудовом договоре",
              D: "Согласие руководителя компании",
            },
            correct: "B",
            explanation:
              "По GDPR согласие должно быть свободным, конкретным, информированным и однозначным выражением воли субъекта данных.",
            difficulty: "easy",
            role: "general",
            topic: "gdpr_basics",
          },
          {
            id: "b31_q8",
            text: "Что такое «право на забвение» (right to erasure) по GDPR?",
            options: {
              A: "Право компании удалить любые данные",
              B: "Право субъекта данных потребовать удаления своих персональных данных",
              C: "Право забыть пароль",
              D: "Право не платить за услуги",
            },
            correct: "B",
            explanation:
              "Право на забвение позволяет субъекту данных требовать удаления его персональных данных при определённых условиях.",
            difficulty: "easy",
            role: "general",
            topic: "gdpr_basics",
          },
          {
            id: "b31_q9",
            text: "Кто такой DPO (Data Protection Officer) по GDPR?",
            options: {
              A: "Директор по продажам",
              B: "Ответственный за защиту персональных данных в организации",
              C: "Программист базы данных",
              D: "Внешний аудитор",
            },
            correct: "B",
            explanation:
              "DPO — специалист, назначаемый организацией для контроля соблюдения правил защиты персональных данных по GDPR.",
            difficulty: "easy",
            role: "general",
            topic: "gdpr_basics",
          },
        ],
      },
    ],
  },
  {
    id: 32,
    title: "Циклы while и маржа прибыли",
    difficulty: "easy",
    categories: [
      {
        name: "Цикл while и break",
        role: "automation",
        questions: [
          {
            id: "b32_q1",
            text: "Что делает оператор break в цикле Python?",
            options: {
              A: "Пропускает текущую итерацию",
              B: "Немедленно завершает цикл",
              C: "Перезапускает цикл",
              D: "Выводит сообщение об ошибке",
            },
            correct: "B",
            explanation:
              "Оператор break немедленно прерывает выполнение ближайшего цикла (for или while).",
            difficulty: "easy",
            role: "automation",
            topic: "python_loops",
          },
          {
            id: "b32_q2",
            text: "Что делает оператор continue в цикле Python?",
            options: {
              A: "Завершает цикл",
              B: "Пропускает оставшийся код итерации и переходит к следующей",
              C: "Удаляет переменную цикла",
              D: "Выводит текущий элемент",
            },
            correct: "B",
            explanation:
              "continue пропускает оставшуюся часть текущей итерации и переходит к следующей итерации цикла.",
            difficulty: "easy",
            role: "automation",
            topic: "python_loops",
          },
          {
            id: "b32_q3",
            text: "Что произойдёт при выполнении while True без break?",
            options: {
              A: "Цикл выполнится один раз",
              B: "Бесконечный цикл",
              C: "Ошибка синтаксиса",
              D: "Цикл не выполнится",
            },
            correct: "B",
            explanation:
              "while True создаёт бесконечный цикл, который будет выполняться до принудительной остановки или break.",
            difficulty: "easy",
            role: "automation",
            topic: "python_loops",
          },
        ],
      },
      {
        name: "Типы маржи и рентабельности",
        role: "controller",
        questions: [
          {
            id: "b32_q4",
            text: "Что такое валовая маржа (gross margin)?",
            options: {
              A: "Чистая прибыль / Выручка",
              B: "(Выручка − Себестоимость) / Выручка × 100%",
              C: "Операционная прибыль / Активы",
              D: "Выручка / Количество сотрудников",
            },
            correct: "B",
            explanation:
              "Валовая маржа = (Выручка − Себестоимость) / Выручка × 100%. Показывает долю прибыли после вычета прямых затрат.",
            difficulty: "easy",
            role: "controller",
            topic: "kpi_financial",
          },
          {
            id: "b32_q5",
            text: "Чем операционная маржа отличается от валовой?",
            options: {
              A: "Ничем, это одно и то же",
              B: "Операционная маржа учитывает также операционные расходы (SGA)",
              C: "Валовая маржа включает налоги",
              D: "Операционная маржа не учитывает себестоимость",
            },
            correct: "B",
            explanation:
              "Операционная маржа вычитает из выручки и себестоимость, и операционные расходы (зарплаты, аренда и т.д.).",
            difficulty: "easy",
            role: "controller",
            topic: "kpi_financial",
          },
          {
            id: "b32_q6",
            text: "Как рассчитывается ROI (Return on Investment)?",
            options: {
              A: "(Прибыль от инвестиции − Стоимость инвестиции) / Стоимость инвестиции × 100%",
              B: "Выручка / Количество клиентов",
              C: "Активы / Обязательства",
              D: "Чистая прибыль / Количество сотрудников",
            },
            correct: "A",
            explanation:
              "ROI = (Прибыль − Затраты) / Затраты × 100%. Показывает эффективность инвестиций в процентах.",
            difficulty: "easy",
            role: "controller",
            topic: "kpi_financial",
          },
        ],
      },
      {
        name: "Kanban: поток и метрики",
        role: "project",
        questions: [
          {
            id: "b32_q7",
            text: "Что такое lead time в Kanban?",
            options: {
              A: "Время, проведённое на совещаниях",
              B: "Время от создания задачи до её завершения",
              C: "Время на обед",
              D: "Время подготовки отчёта",
            },
            correct: "B",
            explanation:
              "Lead time — полное время от момента создания задачи (запроса) до её полного выполнения.",
            difficulty: "easy",
            role: "project",
            topic: "kanban_basics",
          },
          {
            id: "b32_q8",
            text: "Что такое cycle time в Kanban?",
            options: {
              A: "Время на планирование спринта",
              B: "Время от начала работы над задачей до её завершения",
              C: "Периодичность релизов",
              D: "Время ежедневной встречи",
            },
            correct: "B",
            explanation:
              "Cycle time — время от момента, когда команда начала работу над задачей, до её завершения.",
            difficulty: "easy",
            role: "project",
            topic: "kanban_basics",
          },
          {
            id: "b32_q9",
            text: "Почему важно ограничивать WIP (Work In Progress) в Kanban?",
            options: {
              A: "Чтобы сотрудники больше отдыхали",
              B: "Чтобы уменьшить переключение между задачами и ускорить поток",
              C: "Чтобы экономить электроэнергию",
              D: "Чтобы сократить количество сотрудников",
            },
            correct: "B",
            explanation:
              "WIP-лимиты снижают переключение контекста, выявляют узкие места и ускоряют прохождение задач через систему.",
            difficulty: "easy",
            role: "project",
            topic: "kanban_basics",
          },
        ],
      },
    ],
  },
  {
    id: 33,
    title: "SQL-запросы и финансовая деятельность",
    difficulty: "easy",
    categories: [
      {
        name: "Продвинутые JOIN",
        role: "automation",
        questions: [
          {
            id: "b33_q1",
            text: "Что такое FULL OUTER JOIN в SQL?",
            options: {
              A: "Возвращает только совпадающие строки",
              B: "Возвращает все строки из обеих таблиц, с NULL для несовпадений",
              C: "Возвращает только строки из левой таблицы",
              D: "Удаляет все дублирующиеся строки",
            },
            correct: "B",
            explanation:
              "FULL OUTER JOIN возвращает все строки из обеих таблиц, подставляя NULL там, где нет совпадений.",
            difficulty: "easy",
            role: "automation",
            topic: "sql_joins",
          },
          {
            id: "b33_q2",
            text: "Что такое CROSS JOIN в SQL?",
            options: {
              A: "Соединение по общему ключу",
              B: "Декартово произведение двух таблиц (каждая строка с каждой)",
              C: "Объединение одинаковых строк",
              D: "Удаление строк из таблицы",
            },
            correct: "B",
            explanation:
              "CROSS JOIN создаёт декартово произведение — каждая строка первой таблицы соединяется с каждой строкой второй.",
            difficulty: "easy",
            role: "automation",
            topic: "sql_joins",
          },
          {
            id: "b33_q3",
            text: "Для чего используется ключевое слово ON в операторе JOIN?",
            options: {
              A: "Для включения таблицы в базу данных",
              B: "Для указания условия соединения таблиц",
              C: "Для сортировки результатов",
              D: "Для ограничения количества строк",
            },
            correct: "B",
            explanation:
              "ON указывает условие, по которому строки двух таблиц сопоставляются при JOIN (например, ON a.id = b.user_id).",
            difficulty: "easy",
            role: "automation",
            topic: "sql_joins",
          },
        ],
      },
      {
        name: "Финансовая деятельность",
        role: "controller",
        questions: [
          {
            id: "b33_q4",
            text: "Получение банковского кредита относится к какому виду деятельности в отчёте о движении денежных средств?",
            options: {
              A: "Операционная",
              B: "Инвестиционная",
              C: "Финансовая",
              D: "Производственная",
            },
            correct: "C",
            explanation:
              "Получение и погашение кредитов, выпуск акций — всё это относится к финансовой деятельности.",
            difficulty: "easy",
            role: "controller",
            topic: "cashflow_basics",
          },
          {
            id: "b33_q5",
            text: "Что такое свободный денежный поток (Free Cash Flow)?",
            options: {
              A: "Деньги, доступные для бесплатных покупок",
              B: "Операционный денежный поток минус капитальные затраты",
              C: "Общая выручка компании",
              D: "Сумма всех инвестиций",
            },
            correct: "B",
            explanation:
              "Free Cash Flow = Операционный денежный поток − Капитальные затраты. Показывает деньги, доступные для распределения.",
            difficulty: "easy",
            role: "controller",
            topic: "cashflow_basics",
          },
          {
            id: "b33_q6",
            text: "Почему компания может быть прибыльной, но испытывать дефицит денежных средств?",
            options: {
              A: "Это невозможно",
              B: "Из-за разницы между начислением прибыли и фактическим поступлением денег",
              C: "Из-за слишком большого количества сотрудников",
              D: "Из-за высокого курса валют",
            },
            correct: "B",
            explanation:
              "Прибыль начисляется по методу начисления, а денежные средства — по кассовому. Клиенты могут не оплатить счета вовремя.",
            difficulty: "easy",
            role: "controller",
            topic: "cashflow_basics",
          },
        ],
      },
      {
        name: "Улучшение процессов: инструменты",
        role: "project",
        questions: [
          {
            id: "b33_q7",
            text: "Что такое диаграмма Исикавы (fishbone diagram)?",
            options: {
              A: "Диаграмма для планирования бюджета",
              B: "Инструмент для выявления коренных причин проблемы",
              C: "Тип организационной структуры",
              D: "Метод оценки рисков",
            },
            correct: "B",
            explanation:
              "Диаграмма Исикавы (рыбья кость) визуализирует возможные причины проблемы по категориям для анализа корневых причин.",
            difficulty: "easy",
            role: "project",
            topic: "process_improvement",
          },
          {
            id: "b33_q8",
            text: "Что такое метод 5 Why (5 Почему)?",
            options: {
              A: "Метод оценки 5 лучших сотрудников",
              B: "Последовательное задавание вопроса «Почему?» для нахождения корневой причины",
              C: "5 этапов разработки продукта",
              D: "Метод распределения бюджета",
            },
            correct: "B",
            explanation:
              "Метод 5 Why — техника, при которой вопрос «Почему?» задаётся последовательно (обычно 5 раз) для нахождения корневой причины.",
            difficulty: "easy",
            role: "project",
            topic: "process_improvement",
          },
          {
            id: "b33_q9",
            text: "Что такое bottleneck (узкое место) в процессе?",
            options: {
              A: "Самый быстрый этап процесса",
              B: "Этап, ограничивающий пропускную способность всего процесса",
              C: "Самый дешёвый ресурс",
              D: "Новый сотрудник в команде",
            },
            correct: "B",
            explanation:
              "Узкое место — этап процесса с наименьшей пропускной способностью, который ограничивает производительность всей системы.",
            difficulty: "easy",
            role: "project",
            topic: "process_improvement",
          },
        ],
      },
    ],
  },
  {
    id: 34,
    title: "UiPath-процессы и график выбор",
    difficulty: "easy",
    categories: [
      {
        name: "Типы процессов UiPath",
        role: "automation",
        questions: [
          {
            id: "b34_q1",
            text: "Что такое Attended Robot в UiPath?",
            options: {
              A: "Робот, работающий полностью автономно на сервере",
              B: "Робот, работающий на компьютере пользователя и требующий его участия",
              C: "Робот для тестирования",
              D: "Робот для обработки данных",
            },
            correct: "B",
            explanation:
              "Attended Robot работает на рабочей станции пользователя и запускается/взаимодействует с пользователем.",
            difficulty: "easy",
            role: "automation",
            topic: "uipath_studio",
          },
          {
            id: "b34_q2",
            text: "Что такое Unattended Robot в UiPath?",
            options: {
              A: "Робот с графическим интерфейсом",
              B: "Робот, работающий автономно без участия пользователя",
              C: "Робот для обучения",
              D: "Демонстрационный робот",
            },
            correct: "B",
            explanation:
              "Unattended Robot работает автономно на сервере, запускаясь по расписанию или триггерам без участия человека.",
            difficulty: "easy",
            role: "automation",
            topic: "uipath_studio",
          },
          {
            id: "b34_q3",
            text: "Для чего используется UiPath Orchestrator?",
            options: {
              A: "Для написания кода роботов",
              B: "Для управления, мониторинга и планирования запуска роботов",
              C: "Для создания баз данных",
              D: "Для разработки веб-сайтов",
            },
            correct: "B",
            explanation:
              "Orchestrator — веб-платформа для управления роботами, планирования запусков, мониторинга и распределения задач.",
            difficulty: "easy",
            role: "automation",
            topic: "uipath_studio",
          },
        ],
      },
      {
        name: "Выбор типа графика",
        role: "controller",
        questions: [
          {
            id: "b34_q4",
            text: "Какой график лучше показывает корреляцию между двумя переменными?",
            options: {
              A: "Круговая диаграмма",
              B: "Точечная диаграмма (scatter plot)",
              C: "Гистограмма",
              D: "Линейный график",
            },
            correct: "B",
            explanation:
              "Scatter plot (точечная диаграмма) показывает взаимосвязь между двумя количественными переменными.",
            difficulty: "easy",
            role: "controller",
            topic: "data_visualization",
          },
          {
            id: "b34_q5",
            text: "Почему круговая диаграмма не рекомендуется при большом количестве категорий?",
            options: {
              A: "Она становится слишком большой",
              B: "Секторы становятся слишком маленькими и трудночитаемыми",
              C: "Она не поддерживает более 5 категорий",
              D: "Она требует больше оперативной памяти",
            },
            correct: "B",
            explanation:
              "При многих категориях секторы круговой диаграммы слишком мелкие, что затрудняет сравнение и восприятие данных.",
            difficulty: "easy",
            role: "controller",
            topic: "data_visualization",
          },
          {
            id: "b34_q6",
            text: "Что такое дашборд (dashboard) в контексте бизнес-аналитики?",
            options: {
              A: "Физическая доска в офисе",
              B: "Интерактивная панель с визуализациями ключевых показателей",
              C: "Список задач на неделю",
              D: "Таблица с контактами клиентов",
            },
            correct: "B",
            explanation:
              "Дашборд — визуальная панель, объединяющая графики и KPI для оперативного мониторинга бизнес-показателей.",
            difficulty: "easy",
            role: "controller",
            topic: "data_visualization",
          },
        ],
      },
      {
        name: "Качество: инструменты и методы",
        role: "project",
        questions: [
          {
            id: "b34_q7",
            text: "Что такое чек-лист (checklist) в управлении качеством?",
            options: {
              A: "Финансовый документ",
              B: "Список критериев для проверки соответствия требованиям",
              C: "Табель рабочего времени",
              D: "Договор с поставщиком",
            },
            correct: "B",
            explanation:
              "Чек-лист — структурированный список пунктов для проверки, что все требования и стандарты соблюдены.",
            difficulty: "easy",
            role: "project",
            topic: "quality_management",
          },
          {
            id: "b34_q8",
            text: "Что дешевле — предотвратить дефект или исправить его после обнаружения?",
            options: {
              A: "Исправить после обнаружения",
              B: "Предотвратить дефект",
              C: "Стоимость одинаковая",
              D: "Зависит от типа проекта",
            },
            correct: "B",
            explanation:
              "Предотвращение дефектов (QA) всегда дешевле, чем их обнаружение и исправление (QC), особенно на поздних стадиях.",
            difficulty: "easy",
            role: "project",
            topic: "quality_management",
          },
          {
            id: "b34_q9",
            text: "Что такое SLA (Service Level Agreement)?",
            options: {
              A: "Лицензия на программное обеспечение",
              B: "Соглашение об уровне предоставляемых услуг",
              C: "Стандарт бухгалтерского учёта",
              D: "Система управления рисками",
            },
            correct: "B",
            explanation:
              "SLA — формальное соглашение, определяющее уровень качества и доступности услуги между поставщиком и клиентом.",
            difficulty: "easy",
            role: "project",
            topic: "quality_management",
          },
        ],
      },
    ],
  },
  {
    id: 35,
    title: "Git-ветки и закрытие периода",
    difficulty: "easy",
    categories: [
      {
        name: "Ветвление в Git",
        role: "automation",
        questions: [
          {
            id: "b35_q1",
            text: "Что такое ветка (branch) в Git?",
            options: {
              A: "Копия всего проекта на другом сервере",
              B: "Независимая линия разработки для изолированной работы",
              C: "Резервная копия файла",
              D: "Версия базы данных",
            },
            correct: "B",
            explanation:
              "Ветка в Git — отдельная линия разработки, позволяющая работать над изменениями изолированно от основного кода.",
            difficulty: "easy",
            role: "automation",
            topic: "version_control",
          },
          {
            id: "b35_q2",
            text: "Что делает команда git merge?",
            options: {
              A: "Удаляет ветку",
              B: "Объединяет изменения из одной ветки в другую",
              C: "Создаёт новый репозиторий",
              D: "Отменяет последний коммит",
            },
            correct: "B",
            explanation:
              "git merge объединяет историю и изменения из указанной ветки в текущую ветку.",
            difficulty: "easy",
            role: "automation",
            topic: "version_control",
          },
          {
            id: "b35_q3",
            text: "Что такое конфликт слияния (merge conflict) в Git?",
            options: {
              A: "Ошибка в интернет-соединении",
              B: "Ситуация, когда Git не может автоматически объединить изменения в одном файле",
              C: "Вирус в репозитории",
              D: "Удаление ветки по ошибке",
            },
            correct: "B",
            explanation:
              "Merge conflict возникает, когда в двух ветках изменены одни и те же строки файла, и Git не может определить правильный вариант.",
            difficulty: "easy",
            role: "automation",
            topic: "version_control",
          },
        ],
      },
      {
        name: "Закрытие отчётного периода",
        role: "controller",
        questions: [
          {
            id: "b35_q4",
            text: "Какой первый шаг при закрытии месяца (monthly close)?",
            options: {
              A: "Отправка отчёта руководству",
              B: "Сверка всех счетов и проводок",
              C: "Расчёт бонусов сотрудникам",
              D: "Планирование следующего квартала",
            },
            correct: "B",
            explanation:
              "Первый шаг при закрытии месяца — сверка (reconciliation) всех счетов, транзакций и проводок.",
            difficulty: "easy",
            role: "controller",
            topic: "reporting_basics",
          },
          {
            id: "b35_q5",
            text: "Что такое accrual (начисление) в бухгалтерском учёте?",
            options: {
              A: "Наличный платёж",
              B: "Признание расхода или дохода до фактического движения денег",
              C: "Банковская комиссия",
              D: "Скидка для клиента",
            },
            correct: "B",
            explanation:
              "Начисление (accrual) — признание дохода или расхода в периоде, когда они возникли, независимо от движения денежных средств.",
            difficulty: "easy",
            role: "controller",
            topic: "reporting_basics",
          },
          {
            id: "b35_q6",
            text: "Почему важно соблюдать сроки закрытия отчётного периода?",
            options: {
              A: "Чтобы получить бонус",
              B: "Для своевременного предоставления достоверной финансовой информации",
              C: "Чтобы уйти в отпуск",
              D: "Это не важно",
            },
            correct: "B",
            explanation:
              "Своевременное закрытие обеспечивает актуальную и достоверную финансовую информацию для принятия управленческих решений.",
            difficulty: "easy",
            role: "controller",
            topic: "reporting_basics",
          },
        ],
      },
      {
        name: "ИИ: применение на практике",
        role: "general",
        questions: [
          {
            id: "b35_q7",
            text: "Что такое чат-бот с ИИ?",
            options: {
              A: "Физический робот для доставки",
              B: "Программа, имитирующая общение с человеком на естественном языке",
              C: "Приложение для видеозвонков",
              D: "Система бухгалтерского учёта",
            },
            correct: "B",
            explanation:
              "Чат-бот с ИИ — программа, использующая обработку естественного языка для общения с пользователями.",
            difficulty: "easy",
            role: "general",
            topic: "ai_basics",
          },
          {
            id: "b35_q8",
            text: "Что такое обучение с учителем (supervised learning)?",
            options: {
              A: "Обучение студентов в классе",
              B: "Метод ML, где модель обучается на размеченных данных с правильными ответами",
              C: "Обучение робота ходить",
              D: "Обучение без данных",
            },
            correct: "B",
            explanation:
              "Supervised learning — метод ML, при котором модель учится на данных с известными правильными ответами (метками).",
            difficulty: "easy",
            role: "general",
            topic: "ai_basics",
          },
          {
            id: "b35_q9",
            text: "Какой пример использования ИИ для автоматизации бизнес-процессов?",
            options: {
              A: "Ручной ввод данных",
              B: "Автоматическое извлечение данных из счетов-фактур",
              C: "Печать документов",
              D: "Сканирование бумажных книг",
            },
            correct: "B",
            explanation:
              "ИИ используется для автоматического распознавания и извлечения данных из документов (Intelligent Document Processing).",
            difficulty: "easy",
            role: "general",
            topic: "ai_basics",
          },
        ],
      },
    ],
  },
  {
    id: 36,
    title: "Сетевые протоколы и тайм-менеджмент",
    difficulty: "easy",
    categories: [
      {
        name: "Сетевые протоколы",
        role: "automation",
        questions: [
          {
            id: "b36_q1",
            text: "Какой протокол используется для безопасной передачи данных в вебе?",
            options: {
              A: "HTTP",
              B: "HTTPS",
              C: "FTP",
              D: "SMTP",
            },
            correct: "B",
            explanation:
              "HTTPS (HTTP Secure) использует SSL/TLS шифрование для безопасной передачи данных между браузером и сервером.",
            difficulty: "easy",
            role: "automation",
            topic: "networking_basics",
          },
          {
            id: "b36_q2",
            text: "Какой порт по умолчанию использует HTTP?",
            options: {
              A: "443",
              B: "80",
              C: "22",
              D: "3306",
            },
            correct: "B",
            explanation:
              "HTTP по умолчанию использует порт 80, а HTTPS — порт 443.",
            difficulty: "easy",
            role: "automation",
            topic: "networking_basics",
          },
          {
            id: "b36_q3",
            text: "Что такое localhost?",
            options: {
              A: "Внешний сервер в интернете",
              B: "Адрес, ссылающийся на текущий компьютер (обычно 127.0.0.1)",
              C: "Название операционной системы",
              D: "Тип базы данных",
            },
            correct: "B",
            explanation:
              "localhost (127.0.0.1) — специальный адрес, который всегда указывает на текущий компьютер для локальной разработки.",
            difficulty: "easy",
            role: "automation",
            topic: "networking_basics",
          },
        ],
      },
      {
        name: "Бизнес-партнёрство: практика",
        role: "controller",
        questions: [
          {
            id: "b36_q4",
            text: "Что такое ad-hoc анализ в контексте бизнес-партнёрства?",
            options: {
              A: "Ежемесячный стандартный отчёт",
              B: "Разовый анализ по конкретному запросу бизнеса",
              C: "Автоматически генерируемый отчёт",
              D: "Годовой аудит",
            },
            correct: "B",
            explanation:
              "Ad-hoc анализ — разовое аналитическое исследование, выполняемое по конкретному запросу бизнеса для принятия решения.",
            difficulty: "easy",
            role: "controller",
            topic: "business_partnering",
          },
          {
            id: "b36_q5",
            text: "Зачем финансовый бизнес-партнёр участвует в бизнес-совещаниях?",
            options: {
              A: "Только для записи протокола",
              B: "Для предоставления финансовой перспективы при обсуждении решений",
              C: "Для контроля посещаемости",
              D: "Для организации кофе-брейка",
            },
            correct: "B",
            explanation:
              "Бизнес-партнёр участвует в совещаниях, чтобы обеспечивать финансовую перспективу и подкреплять решения данными.",
            difficulty: "easy",
            role: "controller",
            topic: "business_partnering",
          },
          {
            id: "b36_q6",
            text: "Что такое financial storytelling?",
            options: {
              A: "Написание художественных книг",
              B: "Умение подать финансовые данные в виде понятной и убедительной истории",
              C: "Составление фиктивных отчётов",
              D: "Пересказ новостей финансовых рынков",
            },
            correct: "B",
            explanation:
              "Financial storytelling — навык представления финансовых данных в формате понятного нарратива для нефинансовых стейкхолдеров.",
            difficulty: "easy",
            role: "controller",
            topic: "business_partnering",
          },
        ],
      },
      {
        name: "Тайм-менеджмент и приоритизация",
        role: "general",
        questions: [
          {
            id: "b36_q7",
            text: "Что означает принцип «съешь лягушку» (Eat the Frog) в тайм-менеджменте?",
            options: {
              A: "Начать день с завтрака",
              B: "Выполнить самую сложную и важную задачу первой",
              C: "Работать допоздна",
              D: "Делегировать все задачи",
            },
            correct: "B",
            explanation:
              "Метод «Eat the Frog» предлагает начинать день с самой сложной или неприятной, но важной задачи.",
            difficulty: "easy",
            role: "general",
            topic: "workplace_skills",
          },
          {
            id: "b36_q8",
            text: "Что такое делегирование задач?",
            options: {
              A: "Отказ от выполнения задачи",
              B: "Передача задачи другому человеку с соответствующими полномочиями",
              C: "Откладывание задачи на потом",
              D: "Удаление задачи из списка",
            },
            correct: "B",
            explanation:
              "Делегирование — передача задачи другому лицу с предоставлением ему необходимых полномочий и ресурсов для её выполнения.",
            difficulty: "easy",
            role: "general",
            topic: "workplace_skills",
          },
          {
            id: "b36_q9",
            text: "Какие задачи по матрице Эйзенхауэра следует делать в первую очередь?",
            options: {
              A: "Несрочные и неважные",
              B: "Срочные и важные",
              C: "Срочные, но неважные",
              D: "Несрочные, но важные",
            },
            correct: "B",
            explanation:
              "По матрице Эйзенхауэра задачи в квадранте «Срочно и важно» выполняются немедленно в первую очередь.",
            difficulty: "easy",
            role: "general",
            topic: "workplace_skills",
          },
        ],
      },
    ],
  },
  {
    id: 37,
    title: "Docker-команды и Sprint-события",
    difficulty: "easy",
    categories: [
      {
        name: "Команды Docker",
        role: "automation",
        questions: [
          {
            id: "b37_q1",
            text: "Что делает команда docker run?",
            options: {
              A: "Удаляет контейнер",
              B: "Создаёт и запускает новый контейнер из образа",
              C: "Обновляет Docker",
              D: "Создаёт новый образ",
            },
            correct: "B",
            explanation:
              "docker run создаёт новый контейнер на основе указанного образа и запускает его.",
            difficulty: "easy",
            role: "automation",
            topic: "docker_basics",
          },
          {
            id: "b37_q2",
            text: "Что делает команда docker ps?",
            options: {
              A: "Удаляет все контейнеры",
              B: "Показывает список запущенных контейнеров",
              C: "Создаёт новый образ",
              D: "Перезапускает Docker",
            },
            correct: "B",
            explanation:
              "docker ps выводит список всех текущих запущенных контейнеров с их ID, именем и статусом.",
            difficulty: "easy",
            role: "automation",
            topic: "docker_basics",
          },
          {
            id: "b37_q3",
            text: "Что такое Docker Hub?",
            options: {
              A: "Физический сервер Docker",
              B: "Облачный реестр для хранения и обмена Docker-образами",
              C: "IDE для написания кода",
              D: "Операционная система",
            },
            correct: "B",
            explanation:
              "Docker Hub — облачный реестр (registry), где можно хранить, находить и скачивать Docker-образы.",
            difficulty: "easy",
            role: "automation",
            topic: "docker_basics",
          },
        ],
      },
      {
        name: "Сводные таблицы: расчёты",
        role: "controller",
        questions: [
          {
            id: "b37_q4",
            text: "Какие функции агрегации доступны в сводных таблицах помимо суммы?",
            options: {
              A: "Только среднее",
              B: "Среднее, количество, минимум, максимум и другие",
              C: "Только количество",
              D: "Только минимум и максимум",
            },
            correct: "B",
            explanation:
              "Сводные таблицы поддерживают множество функций: сумма, среднее, количество, минимум, максимум, дисперсия и др.",
            difficulty: "easy",
            role: "controller",
            topic: "pivot_tables",
          },
          {
            id: "b37_q5",
            text: "Что такое фильтр (slicer) в контексте сводных таблиц?",
            options: {
              A: "Инструмент для удаления данных",
              B: "Визуальный элемент для интерактивной фильтрации данных в таблице",
              C: "Тип графика",
              D: "Формула расчёта",
            },
            correct: "B",
            explanation:
              "Slicer (срез) — визуальный фильтр, позволяющий интерактивно фильтровать данные в сводной таблице одним кликом.",
            difficulty: "easy",
            role: "controller",
            topic: "pivot_tables",
          },
          {
            id: "b37_q6",
            text: "Для чего используется область значений (Values) в сводной таблице?",
            options: {
              A: "Для указания заголовков таблицы",
              B: "Для размещения полей, по которым выполняются вычисления (сумма, среднее и т.д.)",
              C: "Для фильтрации строк",
              D: "Для сортировки столбцов",
            },
            correct: "B",
            explanation:
              "В область значений помещаются числовые поля, над которыми выполняются агрегатные операции (сумма, среднее и т.д.).",
            difficulty: "easy",
            role: "controller",
            topic: "pivot_tables",
          },
        ],
      },
      {
        name: "События Scrum-спринта",
        role: "project",
        questions: [
          {
            id: "b37_q7",
            text: "Что такое Sprint Planning?",
            options: {
              A: "Ежедневная встреча",
              B: "Встреча для определения целей и содержания работы на предстоящий спринт",
              C: "Отчёт о завершённом спринте",
              D: "Собеседование с кандидатом",
            },
            correct: "B",
            explanation:
              "Sprint Planning — встреча в начале спринта, на которой команда определяет цель спринта и выбирает задачи из бэклога.",
            difficulty: "easy",
            role: "project",
            topic: "scrum_framework",
          },
          {
            id: "b37_q8",
            text: "Что такое Sprint Retrospective?",
            options: {
              A: "Демонстрация продукта клиенту",
              B: "Встреча для анализа прошедшего спринта и улучшения процесса работы",
              C: "Планирование следующего проекта",
              D: "Обзор бюджета",
            },
            correct: "B",
            explanation:
              "Ретроспектива — встреча, где команда обсуждает, что прошло хорошо, что можно улучшить, и определяет действия.",
            difficulty: "easy",
            role: "project",
            topic: "scrum_framework",
          },
          {
            id: "b37_q9",
            text: "Какова рекомендуемая длительность Daily Scrum?",
            options: {
              A: "1 час",
              B: "15 минут",
              C: "30 минут",
              D: "5 минут",
            },
            correct: "B",
            explanation:
              "Daily Scrum — короткая встреча не более 15 минут для синхронизации команды и обсуждения плана на день.",
            difficulty: "easy",
            role: "project",
            topic: "scrum_framework",
          },
        ],
      },
    ],
  },
  {
    id: 38,
    title: "CLI-навигация и анализ отклонений",
    difficulty: "easy",
    categories: [
      {
        name: "Навигация в CLI",
        role: "automation",
        questions: [
          {
            id: "b38_q1",
            text: "Какая команда создаёт новую директорию в терминале?",
            options: {
              A: "newdir",
              B: "mkdir",
              C: "create",
              D: "mkfolder",
            },
            correct: "B",
            explanation:
              "mkdir (make directory) — команда для создания новой директории (папки) в файловой системе.",
            difficulty: "easy",
            role: "automation",
            topic: "cli_basics",
          },
          {
            id: "b38_q2",
            text: "Какая команда удаляет файл в Linux/macOS?",
            options: {
              A: "del",
              B: "rm",
              C: "erase",
              D: "remove",
            },
            correct: "B",
            explanation:
              "rm (remove) — команда для удаления файлов в Unix-подобных системах (Linux, macOS).",
            difficulty: "easy",
            role: "automation",
            topic: "cli_basics",
          },
          {
            id: "b38_q3",
            text: "Что делает команда pwd в терминале?",
            options: {
              A: "Меняет пароль",
              B: "Показывает полный путь к текущей директории",
              C: "Создаёт новый файл",
              D: "Закрывает терминал",
            },
            correct: "B",
            explanation:
              "pwd (print working directory) выводит полный путь к текущей рабочей директории.",
            difficulty: "easy",
            role: "automation",
            topic: "cli_basics",
          },
        ],
      },
      {
        name: "Анализ отклонений: практика",
        role: "controller",
        questions: [
          {
            id: "b38_q4",
            text: "Если фактическая выручка выше бюджетной, это...",
            options: {
              A: "Неблагоприятное отклонение",
              B: "Благоприятное (положительное) отклонение",
              C: "Нулевое отклонение",
              D: "Ошибка в бюджете",
            },
            correct: "B",
            explanation:
              "Превышение фактической выручки над бюджетной — благоприятное отклонение, означающее, что компания заработала больше плана.",
            difficulty: "easy",
            role: "controller",
            topic: "variance_analysis",
          },
          {
            id: "b38_q5",
            text: "Какая формула используется для расчёта отклонения?",
            options: {
              A: "Бюджет × Факт",
              B: "Факт − Бюджет (или Бюджет − Факт для расходов)",
              C: "Факт + Бюджет",
              D: "Бюджет / Факт",
            },
            correct: "B",
            explanation:
              "Отклонение = Факт − Бюджет для доходов (положительное = хорошо) или Бюджет − Факт для расходов.",
            difficulty: "easy",
            role: "controller",
            topic: "variance_analysis",
          },
          {
            id: "b38_q6",
            text: "Что такое variance в процентах?",
            options: {
              A: "Абсолютная разница между фактом и бюджетом",
              B: "(Факт − Бюджет) / Бюджет × 100%",
              C: "Факт / Бюджет",
              D: "Бюджет × 100%",
            },
            correct: "B",
            explanation:
              "Процентное отклонение = (Факт − Бюджет) / Бюджет × 100%. Показывает отклонение в относительном выражении.",
            difficulty: "easy",
            role: "controller",
            topic: "variance_analysis",
          },
        ],
      },
      {
        name: "Коммуникации: документы",
        role: "project",
        questions: [
          {
            id: "b38_q7",
            text: "Что такое stakeholder в контексте проекта?",
            options: {
              A: "Только заказчик проекта",
              B: "Любое лицо или группа, заинтересованные в проекте или влияющие на него",
              C: "Только руководитель проекта",
              D: "Только инвестор",
            },
            correct: "B",
            explanation:
              "Стейкхолдер — любое лицо, группа или организация, которые могут влиять на проект или быть затронуты им.",
            difficulty: "easy",
            role: "project",
            topic: "communication_planning",
          },
          {
            id: "b38_q8",
            text: "Что такое матрица RACI?",
            options: {
              A: "Метод оценки рисков",
              B: "Инструмент для распределения ответственности по задачам (Responsible, Accountable, Consulted, Informed)",
              C: "Финансовая модель",
              D: "Метод планирования сроков",
            },
            correct: "B",
            explanation:
              "RACI-матрица определяет роли: Responsible (исполнитель), Accountable (ответственный), Consulted (консультируемый), Informed (информируемый).",
            difficulty: "easy",
            role: "project",
            topic: "communication_planning",
          },
          {
            id: "b38_q9",
            text: "Зачем нужен протокол встречи (meeting minutes)?",
            options: {
              A: "Для развлечения участников",
              B: "Для фиксации решений, задач и ответственных по итогам встречи",
              C: "Для подсчёта опоздавших",
              D: "Для контроля длительности встречи",
            },
            correct: "B",
            explanation:
              "Протокол встречи фиксирует ключевые решения, назначенные задачи и ответственных для контроля исполнения.",
            difficulty: "easy",
            role: "project",
            topic: "communication_planning",
          },
        ],
      },
    ],
  },
  {
    id: 39,
    title: "Python range и логистика APM",
    difficulty: "easy",
    categories: [
      {
        name: "Функция range в Python",
        role: "automation",
        questions: [
          {
            id: "b39_q1",
            text: "Что вернёт range(2, 10, 3) в Python?",
            options: {
              A: "[2, 5, 8]",
              B: "[2, 4, 6, 8]",
              C: "[3, 6, 9]",
              D: "[2, 3, 4, 5, 6, 7, 8, 9]",
            },
            correct: "A",
            explanation:
              "range(2, 10, 3) генерирует числа от 2 с шагом 3: 2, 5, 8 (не включая 10).",
            difficulty: "easy",
            role: "automation",
            topic: "python_loops",
          },
          {
            id: "b39_q2",
            text: "Что делает конструкция for i in range(len(lst))?",
            options: {
              A: "Удаляет элементы списка",
              B: "Итерирует по индексам элементов списка",
              C: "Сортирует список",
              D: "Копирует список",
            },
            correct: "B",
            explanation:
              "range(len(lst)) создаёт последовательность индексов от 0 до длины списка, позволяя обращаться к элементам по индексу.",
            difficulty: "easy",
            role: "automation",
            topic: "python_loops",
          },
          {
            id: "b39_q3",
            text: "Чем list comprehension отличается от обычного цикла for в Python?",
            options: {
              A: "Ничем",
              B: "Позволяет создать список в одну строку более компактно",
              C: "Работает только с числами",
              D: "Не поддерживает условия",
            },
            correct: "B",
            explanation:
              "List comprehension — компактный синтаксис [expr for x in iterable] для создания списков в одну строку.",
            difficulty: "easy",
            role: "automation",
            topic: "python_loops",
          },
        ],
      },
      {
        name: "EBITDA и показатели",
        role: "controller",
        questions: [
          {
            id: "b39_q4",
            text: "Почему EBITDA популярен как показатель для сравнения компаний?",
            options: {
              A: "Потому что его легко произнести",
              B: "Потому что он исключает влияние налоговой политики, структуры капитала и амортизации",
              C: "Потому что он включает все расходы",
              D: "Потому что его используют только в Польше",
            },
            correct: "B",
            explanation:
              "EBITDA нейтрализует различия в налогообложении, финансировании и амортизации, позволяя сравнивать операционную эффективность.",
            difficulty: "easy",
            role: "controller",
            topic: "kpi_financial",
          },
          {
            id: "b39_q5",
            text: "Что такое EBITDA margin?",
            options: {
              A: "EBITDA / Количество сотрудников",
              B: "EBITDA / Выручка × 100%",
              C: "Выручка / EBITDA",
              D: "EBITDA / Активы",
            },
            correct: "B",
            explanation:
              "EBITDA margin = EBITDA / Выручка × 100%. Показывает долю EBITDA в общей выручке компании.",
            difficulty: "easy",
            role: "controller",
            topic: "kpi_financial",
          },
          {
            id: "b39_q6",
            text: "Что НЕ вычитается при расчёте EBITDA?",
            options: {
              A: "Себестоимость товаров",
              B: "Амортизация и износ",
              C: "Зарплаты сотрудников",
              D: "Аренда офиса",
            },
            correct: "B",
            explanation:
              "EBITDA НЕ вычитает проценты (I), налоги (T), износ (D) и амортизацию (A) — именно это отражено в аббревиатуре.",
            difficulty: "easy",
            role: "controller",
            topic: "kpi_financial",
          },
        ],
      },
      {
        name: "Расширение сети APM",
        role: "project",
        questions: [
          {
            id: "b39_q7",
            text: "Какую сеть APM развивает InPost в Польше?",
            options: {
              A: "Сеть фитнес-клубов",
              B: "Сеть пачкоматов (Paczkomat) для выдачи посылок",
              C: "Сеть автозаправок",
              D: "Сеть аптек",
            },
            correct: "B",
            explanation:
              "InPost управляет крупнейшей в Европе сетью пачкоматов (Paczkomat), автоматических пунктов выдачи посылок.",
            difficulty: "easy",
            role: "project",
            topic: "logistics_delivery",
          },
          {
            id: "b39_q8",
            text: "Почему APM-сети выгодны для e-commerce?",
            options: {
              A: "Они дороже курьерской доставки",
              B: "Снижают стоимость последней мили и удобны для клиентов",
              C: "Они доступны только для крупных компаний",
              D: "Они работают только в рабочие дни",
            },
            correct: "B",
            explanation:
              "APM снижают стоимость last mile delivery, работают 24/7 и удобны для покупателей, повышая конверсию.",
            difficulty: "easy",
            role: "project",
            topic: "logistics_delivery",
          },
          {
            id: "b39_q9",
            text: "Что такое fulfillment-центр?",
            options: {
              A: "Центр обслуживания клиентов",
              B: "Складской комплекс, обрабатывающий заказы от хранения до отправки",
              C: "Офис продаж",
              D: "Курьерская служба",
            },
            correct: "B",
            explanation:
              "Fulfillment-центр — склад, выполняющий полный цикл обработки заказов: хранение, комплектация, упаковка и отправка.",
            difficulty: "easy",
            role: "project",
            topic: "logistics_delivery",
          },
        ],
      },
    ],
  },
  {
    id: 40,
    title: "Строковые методы и Agile-доставка",
    difficulty: "easy",
    categories: [
      {
        name: "Замена и поиск в строках",
        role: "automation",
        questions: [
          {
            id: "b40_q1",
            text: "Что делает метод .replace() для строки в Python?",
            options: {
              A: "Удаляет строку",
              B: "Заменяет все вхождения подстроки на другую",
              C: "Переворачивает строку",
              D: "Преобразует строку в число",
            },
            correct: "B",
            explanation:
              "Метод .replace(old, new) возвращает копию строки с заменой всех вхождений old на new.",
            difficulty: "easy",
            role: "automation",
            topic: "python_strings",
          },
          {
            id: "b40_q2",
            text: "Что возвращает метод .find() если подстрока не найдена?",
            options: {
              A: "None",
              B: "-1",
              C: "0",
              D: "Ошибку",
            },
            correct: "B",
            explanation:
              "Метод .find() возвращает -1, если указанная подстрока не найдена в строке.",
            difficulty: "easy",
            role: "automation",
            topic: "python_strings",
          },
          {
            id: "b40_q3",
            text: "Что делает метод .join() в Python?",
            options: {
              A: "Разделяет строку на список",
              B: "Объединяет элементы списка в строку через указанный разделитель",
              C: "Удаляет пробелы",
              D: "Считает количество символов",
            },
            correct: "B",
            explanation:
              "Метод .join(iterable) объединяет элементы итерируемого объекта в строку, вставляя между ними разделитель.",
            difficulty: "easy",
            role: "automation",
            topic: "python_strings",
          },
        ],
      },
      {
        name: "Управление изменениями: внедрение",
        role: "project",
        questions: [
          {
            id: "b40_q4",
            text: "Что такое модель ADKAR в управлении изменениями?",
            options: {
              A: "Финансовая модель",
              B: "Модель: Awareness, Desire, Knowledge, Ability, Reinforcement",
              C: "Метод тестирования ПО",
              D: "Система оценки персонала",
            },
            correct: "B",
            explanation:
              "ADKAR — модель управления изменениями: Осознание, Желание, Знание, Способность, Закрепление.",
            difficulty: "easy",
            role: "project",
            topic: "change_management_basics",
          },
          {
            id: "b40_q5",
            text: "Что помогает снизить сопротивление изменениям в организации?",
            options: {
              A: "Внедрение изменений без предупреждения",
              B: "Обучение сотрудников и вовлечение их в процесс изменений",
              C: "Увольнение несогласных",
              D: "Игнорирование обратной связи",
            },
            correct: "B",
            explanation:
              "Обучение, вовлечение и прозрачная коммуникация помогают снизить сопротивление и повысить принятие изменений.",
            difficulty: "easy",
            role: "project",
            topic: "change_management_basics",
          },
          {
            id: "b40_q6",
            text: "Кто обычно является спонсором изменений (change sponsor)?",
            options: {
              A: "Стажёр",
              B: "Руководитель высокого уровня, поддерживающий и продвигающий изменения",
              C: "Внешний консультант",
              D: "HR-специалист",
            },
            correct: "B",
            explanation:
              "Спонсор изменений — руководитель с полномочиями и влиянием, который активно поддерживает и продвигает инициативу.",
            difficulty: "easy",
            role: "project",
            topic: "change_management_basics",
          },
        ],
      },
      {
        name: "E-commerce и мобильная торговля",
        role: "general",
        questions: [
          {
            id: "b40_q7",
            text: "Что такое m-commerce (мобильная торговля)?",
            options: {
              A: "Торговля только через компьютер",
              B: "Покупка и продажа товаров через мобильные устройства",
              C: "Торговля музыкальными инструментами",
              D: "Доставка еды",
            },
            correct: "B",
            explanation:
              "M-commerce — электронная торговля через мобильные устройства (смартфоны, планшеты), включая мобильные приложения.",
            difficulty: "easy",
            role: "general",
            topic: "ecommerce_poland",
          },
          {
            id: "b40_q8",
            text: "Что такое конверсия (conversion rate) в e-commerce?",
            options: {
              A: "Обменный курс валют",
              B: "Процент посетителей сайта, совершивших целевое действие (покупку)",
              C: "Скорость загрузки сайта",
              D: "Количество возвратов товаров",
            },
            correct: "B",
            explanation:
              "Conversion rate — доля посетителей, которые выполнили целевое действие (покупку), от общего числа посетителей.",
            difficulty: "easy",
            role: "general",
            topic: "ecommerce_poland",
          },
          {
            id: "b40_q9",
            text: "Что такое GDPR consent banner на веб-сайте?",
            options: {
              A: "Рекламный баннер",
              B: "Всплывающее окно с запросом согласия на обработку cookies и персональных данных",
              C: "Баннер с логотипом компании",
              D: "Уведомление о скидке",
            },
            correct: "B",
            explanation:
              "Consent banner — уведомление на сайте, запрашивающее у пользователя согласие на использование cookies и обработку данных по GDPR.",
            difficulty: "easy",
            role: "general",
            topic: "gdpr_basics",
          },
        ],
      },
    ],
  },
];
