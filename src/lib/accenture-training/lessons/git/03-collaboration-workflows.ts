import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "git-03",
  skillId: "git",
  order: 3,
  title: "Совместная работа, PR и CI/CD",
  subtitle:
    "Удалённые репозитории, pull request, ревью, стратегии ветвления, GitHub Actions, защита веток и релизы для команд поставки.",
  estimatedMinutes: 15,
  objectives: [
    "Корректно использовать fetch, pull и push с отслеживаемыми ветками remote.",
    "Описывать pull request и конструктивное код-ревью для кодовых баз GenAI.",
    "Сопоставлять Git Flow и trunk-based development на концептуальном уровне.",
    "Читать базовый workflow GitHub Actions и понимать защиту веток.",
    "Объяснять теги и релизы для версионирования сервисов и артефактов.",
  ],
  content: [
    {
      type: "heading",
      level: 2,
      content: "Удалённые репозитории",
    },
    {
      type: "text",
      content:
        "**Remote** (обычно `origin`) — ещё одна копия репозитория на сервере. Локальные ветки независимы, пока вы не сделаете **fetch** или **push**. `git clone` настраивает `origin` и переключает ветку по умолчанию. У консалтинговых команд remote на GitHub Enterprise, Azure Repos или GitLab — команды Git те же, отличаются URL и аутентификация.",
    },
    {
      type: "code",
      language: "bash",
      filename: "terminal",
      code: `git remote -v
git fetch origin
git pull origin main
git push -u origin feature/rag-metrics`,
    },
    {
      type: "callout",
      variant: "info",
      title: "fetch и pull",
      content:
        "`git fetch` скачивает коммиты и обновляет ветки отслеживания remote (например `origin/main`) **без** слияния в текущую ветку. `git fetch` + `merge` (или `rebase`, по настройке). Многие сеньоры предпочитают **сначала fetch, затем явно merge/rebase**, чтобы увидеть входящие изменения.",
    },
    {
      type: "heading",
      level: 2,
      content: "Pull request (PR) / merge request",
    },
    {
      type: "text",
      content:
        "**Pull request** — запрос влить одну ветку в другую (часто `feature/*` → `main`). В PR входят **diff**, описание, ссылка на тикет, результаты CI и **треды ревью**. В работе GenAI в описании нужно явно указывать изменения промптов, новые зависимости, влияние на оценку и обработку данных — ревьюеры не угадают риски только по коду.",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Держите PR **небольшими**, когда возможно: проще ревью, быстрее фидбек, проще откат.",
        "**Заголовок** отражает намерение; в теле — контекст, скриншоты, заметки о тестах.",
        "Отвечайте на комментарии ревью коммитами или ответами; закрывайте треды, когда вопрос снят.",
      ],
    },
    {
      type: "tip",
      content:
        "Если PR трогает и Python, и промпты, разделите на два PR или явно структурируйте описание, чтобы можно было одобрить каждый риск отдельно.",
    },
    {
      type: "heading",
      level: 2,
      content: "Git Flow и trunk-based (идея)",
    },
    {
      type: "text",
      content:
        "**Git Flow** использует долгоживущие ветки `develop`, `release/*`, `hotfix/*` с регламентированными слияниями — удобно при календарных релизах и тяжёлом процессе. **Trunk-based** — короткие ветки от `main`, частые merge, флаги фич и сильный CI — типично для продуктовых команд с высокой скоростью. В корпорациях часто смесь: защищённый `main`, теги релизов и автоматические ворота.",
    },
    {
      type: "diagram",
      alt: "Короткие ветки trunk-based и ветки Git Flow",
      content:
        "Trunk-based: короткие ветки от main, PR, частые merge.\\nGit Flow: параллельные develop/release/hotfix и хореография merge.\\nОба опираются на ревью и CI; trunk-based делает упор на малые партии изменений.",
    },
    {
      type: "heading",
      level: 2,
      content: "Основы GitHub Actions",
    },
    {
      type: "text",
      content:
        "CI/CD часто начинается с **GitHub Actions**: YAML в `.github/workflows/` по событиям `push`, `pull_request` или `schedule`. Job выполняется на раннере (Ubuntu и т. д.): checkout, установка зависимостей, **lint/test/build**, публикация артефактов. В GenAI-репозиториях добавляют дымовые тесты с секретами в песочницах — ключи в логи не выводить.",
    },
    {
      type: "code",
      language: "yaml",
      filename: ".github/workflows/ci.yml",
      code: `name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Секреты в Actions",
      content:
        "API-ключи храните в **GitHub Secrets** или интеграциях с vault; в workflow — `${{ secrets.NAME }}`. Маскируйте вывод и не печатайте переменные окружения с учётными данными.",
    },
    {
      type: "heading",
      level: 2,
      content: "Защита веток",
    },
    {
      type: "text",
      content:
        "**Правила защиты** на `main` обычно требуют: merge только через PR, одобрения ревью, зелёные проверки, опционально линейную историю и запрет force-push. Это предотвращает случайные прямые push мимо CI — важно, когда несколько подрядчиков ведут один клиентский репозиторий.",
    },
    {
      type: "heading",
      level: 2,
      content: "Теги и релизы",
    },
    {
      type: "text",
      content:
        "**Тег** указывает на конкретный коммит — часто `v1.3.0` по семантическому версионированию. **Релизы** добавляют заметки, бинарники или образы к тегу. Для сервисов теги запускают деплой; для библиотек — версии PyPI/npm. Лёгкие vs аннотированные теги: аннотированный (`git tag -a`) хранит автора, дату, сообщение — предпочтителен для релизов.",
    },
    {
      type: "code",
      language: "bash",
      filename: "terminal",
      code: `git tag -a v0.2.0 -m "RAG pipeline: hybrid search + eval harness"
git push origin v0.2.0`,
    },
    {
      type: "callout",
      variant: "success",
      title: "Фраза на интервью",
      content:
        "«Мы вливаем через PR в защищённый `main`, CI должен быть зелёным, нужен как минимум один ревьюер, релизы режем по semver-тегам». Так формулировка хорошо ложится на корпоративную поставку.",
    },
  ],
  keyTakeaways: [
    "Remote синхронизирует работу; разница fetch и pull важна для контролируемой интеграции.",
    "PR — единица совместной работы: diff + контекст + CI + ревью.",
    "Git Flow и trunk-based — компромисс между каденцией релизов и размером партий изменений.",
    "GitHub Actions кодирует CI в YAML; секреты нельзя светить в логах.",
    "Теги/релизы фиксируют выкатываемые версии сервисов и библиотек.",
  ],
  interviewTips: [
    "Упомяните защищённый `main`, обязательные проверки и ревью PR как базовые требования на клиентской работе.",
    "Свяжите Actions со стеком: pytest, ruff, mypy или npm test — покажите, что гоняли CI локально.",
    "Если спросят про откат — свяжите теги/релизы с пайплайном деплоя и прошлыми артефактами.",
    "Для GenAI: человеческое ревью для промптов и безопасности, а не только стиль кода.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "git-03-ex-01",
      question:
        "Коллега запушил новые коммиты в `origin/main`. Вы хотите **увидеть** их локально **без** слияния в текущую ветку. Что выполнить?",
      options: [
        "`git pull`",
        "`git push origin main`",
        "`git fetch origin`",
        "`git clone`",
      ],
      correctIndex: 2,
      explanation:
        "`git fetch` обновляет ветки отслеживания вроде `origin/main`, не трогая текущую ветку. Затем можно `git log origin/main` или merge/rebase, когда готовы.",
      interviewNote:
        "Разделение fetch и pull показывает зрелый ежедневный процесс.",
    },
    {
      type: "ordering",
      id: "git-03-ex-02",
      question:
        "Упорядочьте шаги типичного **первого push** новой локальной ветки на `origin` с настройкой upstream.",
      items: [
        "`git push -u origin feature/my-branch`",
        "Закоммитить работу локально на `feature/my-branch`",
        "`git switch -c feature/my-branch` (создать ветку от обновлённой базы)",
      ],
      correctOrder: [2, 1, 0],
      explanation:
        "Создать ветку от правильной базы, закоммитить локально, затем push с `-u`, чтобы дальнейшие `git push`/`git pull` знали remote-ветку.",
      interviewNote:
        "Upstream (`-u`) — частый уточняющий вопрос на живой настройке.",
    },
    {
      type: "true-false",
      id: "git-03-ex-03",
      statement:
        "Правила защиты ветки на `main` заменяют код-ревью — достаточно зелёного CI.",
      correct: false,
      explanation:
        "Правила защиты **закрепляют** процесс (например, обязательные ревью), но не заменяют человеческую оценку. CI ловит много проблем, но не продуктовую корректность, безопасность промптов или архитектурную уместность.",
      interviewNote:
        "Показывает баланс автоматизации и управления — важно для регулируемых клиентов.",
    },
    {
      type: "code-completion",
      id: "git-03-ex-04",
      question:
        "Допишите путь к каталогу, где GitHub Actions ищет workflow (принятое расположение).",
      codeTemplate: "___/workflows/ci.yml",
      language: "bash",
      correctAnswer: ".github",
      acceptableAnswers: [".github"],
      explanation:
        "GitHub загружает YAML workflow из `.github/workflows/` в корне репозитория.",
      interviewNote:
        "Базовое знание путей CI часто подразумевается для full-stack или платформенных стажировок.",
    },
    {
      type: "scenario",
      id: "git-03-ex-05",
      scenario:
        "В репозитории клиента на `main` нужны два апрува, CI обязателен, force-push запрещён. Нужен хотфикс сервиса инференса в продакшене сегодня ночью.",
      question:
        "Опишите использование веток, PR, CI и тегов, чтобы фикс был прослеживаемым и соответствовал политике.",
      sampleAnswer:
        "Создать `hotfix/inference-timeout` от тега продакшена (или защищённой release-ветки, если принято). Минимальный фикс, PR в `main` с ясным описанием и риском. Запросить двух ревьюеров по политике; при онколле — назначенных approvers. Дождаться зелёного CI. Влить через PR (без прямого push). Поставить патч-тег (например `v1.4.1`) на merge-коммит или по процессу клиента. Деплой через их пайплайн; в релиз-нотах — тикет и план отката.",
      keyPoints: [
        "Хотфиксы всё равно идут в защищённый `main`, если нет исключения для `release/*`.",
        "Прослеживаемость: тикет, PR, прогон CI, тег, запись деплоя.",
        "Патч по semver передаёт масштаб операциям.",
      ],
      interviewNote:
        "На интервью Accenture ценят ответы с учётом политики, а не «ковбойский» деплой.",
    },
  ],
};
