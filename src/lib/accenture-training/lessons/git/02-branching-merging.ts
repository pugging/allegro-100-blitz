import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "git-02",
  skillId: "git",
  order: 2,
  title: "Ветвление, слияние и rebase",
  subtitle:
    "Изолируйте работу в ветках, интегрируйте изменения через merge или rebase, разрешайте конфликты, безопасно используйте stash и cherry-pick.",
  estimatedMinutes: 15,
  objectives: [
    "Создавать и переключать ветки для параллельной разработки фич и экспериментов.",
    "Сравнивать merge и rebase и знать, когда что уместно на общих ветках.",
    "Разрешать конфликты слияния через status, diff и маркеры в файлах.",
    "Объяснять результат fast-forward и three-way merge.",
    "Использовать git stash и cherry-pick для сфокусированных обратимых сценариев.",
  ],
  content: [
    {
      type: "heading",
      level: 2,
      content: "Зачем нужны ветки",
    },
    {
      type: "text",
      content:
        "**Ветка** — подвижный указатель на коммит. Ветки позволяют работать над новым ретривером RAG, правкой промпта или исправлением бага **без destabilизации** `main`. После ревью и тестов изменения вливают обратно. На клиентских проектах ветки привязаны к тикетам, PR или релизным поездам.",
    },
    {
      type: "heading",
      level: 3,
      content: "Создание и переключение веток",
    },
    {
      type: "text",
      content:
        "`git branch` перечисляет ветки; `git branch feature/foo` создаёт ветку на текущем коммите. `git switch feature/foo` (или старый `git checkout feature/foo`) переносит HEAD на эту ветку. `git switch -c feature/foo` создаёт и переключает за один шаг.",
    },
    {
      type: "code",
      language: "bash",
      filename: "terminal",
      code: `git switch main
git pull origin main
git switch -c feature/rag-hybrid-search

# ... коммиты ...

git switch main`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Соглашения об именах",
      content:
        "Частые шаблоны: префиксы `feature/`, `fix/`, `chore/`, `docs/`; при Jira/Azure Boards — ID тикета (`feature/ABC-123-hybrid-search`). Последовательность важнее «умных» имён.",
    },
    {
      type: "heading",
      level: 2,
      content: "Слияние: fast-forward и three-way",
    },
    {
      type: "text",
      content:
        "**Merge** объединяет истории. **Fast-forward**: если с момента ответвления `main` не двигался, Git может просто продвинуть `main` до конца вашей ветки — линейная история, без merge-коммита. **Three-way merge**: если обе ветки двигались, Git находит общего предка и создаёт merge-коммит с двумя родителями. Так сохраняется параллельная история.",
    },
    {
      type: "diagram",
      alt: "Fast-forward и merge-коммит",
      content:
        "Fast-forward:\\n  main: A---B\\n  feature:     C\\n  После merge: A---B---C (main на C)\\n\\nThree-way:\\n  main:    A---B---M (merge-коммит)\\n  feature: A---X---Y---/\\n  Общий предок: A или B по ситуации",
    },
    {
      type: "code",
      language: "bash",
      filename: "terminal",
      code: `git switch main
git merge feature/rag-hybrid-search

# Всегда создать merge-коммит (без FF):
# git merge --no-ff feature/rag-hybrid-search`,
    },
    {
      type: "heading",
      level: 2,
      content: "Rebase и merge",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Merge** сохраняет разветвлённую историю; безопасный вариант по умолчанию для общих веток и для начинающих.",
        "**Rebase** переносит ваши коммиты поверх другой ветки, получая **линейную** последовательность. Он **переписывает** SHA у переносимых коммитов.",
        "Правило: **не делайте rebase уже запушенных коммитов**, от которых могли ответвиться другие. Локально можно rebase перед открытием PR, если команда любит линейную историю.",
      ],
    },
    {
      type: "code",
      language: "bash",
      filename: "terminal",
      code: `git switch feature/rag-hybrid-search
git fetch origin
git rebase origin/main

# При конфликтах: правите файлы, затем
# git add <файл>
# git rebase --continue
# Отмена: git rebase --abort`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Дисциплина на общих ветках",
      content:
        "Rebase `main` или ветки, которой пользуются коллеги после того, как они подтянули старые SHA, даёт дубликаты коммитов и больное восстановление. Если сомневаетесь — merge.",
    },
    {
      type: "heading",
      level: 2,
      content: "Конфликты слияния",
    },
    {
      type: "text",
      content:
        "Конфликт — когда Git не может автоматически совместить правки. В файлах появятся маркеры `<<<<<<<`, `=======`, `>>>>>>>` (в JSON/YAML — осторожно). Порядок: `git status` показывает **unmerged** пути; открыть файл, собрать итоговое содержимое, убрать маркеры, `git add`, затем `git merge --continue` или `git commit` (merge) / `git rebase --continue` (rebase).",
    },
    {
      type: "code",
      language: "bash",
      filename: "terminal",
      code: `git merge feature/conflicting-branch
# CONFLICT (content): Merge conflict in src/config.yaml

git status
# исправить файл, затем:
git add src/config.yaml
git merge --continue`,
    },
    {
      type: "tip",
      content:
        "В GenAI-репозиториях конфликты часто в `pyproject.toml`, lock-файлах или общих `prompts/*.md`. Сверяйтесь с тем, кто «источник правды» — иногда промпты ведёт продукт, зависимости — платформа.",
    },
    {
      type: "heading",
      level: 2,
      content: "git stash",
    },
    {
      type: "text",
      content:
        "**Stash** сохраняет снимок «грязного» рабочего дерева (и опционально индекса), чтобы переключить ветку с чистым состоянием. Когда нужен хотфикс посреди правок. `git stash push -m \"wip: tokenizer\"` сохраняет; `git stash list` — стек; `git stash pop` применяет и убирает последний.",
    },
    {
      type: "code",
      language: "bash",
      filename: "terminal",
      code: `git stash push -m "WIP: evaluation notebook"
git switch hotfix/token-limit
# ... работа, коммит ...
git switch -
git stash pop`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Stash только локально",
      content:
        "`git stash` не пушится на remote. Это не замена коммитам, если нужен бэкап или обмен с командой.",
    },
    {
      type: "heading",
      level: 2,
      content: "git cherry-pick",
    },
    {
      type: "text",
      content:
        "**Cherry-pick** накладывает патч существующего коммита на текущую ветку, создавая **новый** коммит с новым SHA. Удобно перенести один фикс с другой ветки без полного merge. Риск: при последующем merge можно продублировать ту же логику — договаривайтесь с командой.",
    },
    {
      type: "code",
      language: "bash",
      filename: "terminal",
      code: `git switch release/1.2
git cherry-pick abc1234`,
    },
  ],
  keyTakeaways: [
    "Ветки изолируют работу; merge или rebase вливают её — rebase переписывает историю.",
    "Fast-forward даёт линейность; three-way merge фиксирует параллельную разработку.",
    "Конфликты: правка файлов, снятие маркеров, индексация, продолжение операции.",
    "Stash — для короткого локального переключения контекста, не для долгого бэкапа.",
    "Cherry-pick переносит отдельные коммиты; согласуйте, чтобы не дублировать фиксы.",
  ],
  interviewTips: [
    "Чётко скажите: «избегаю rebase уже опубликованной общей истории» — это хорошо заходит.",
    "Проговорите разрешение конфликта: status → правка → add → continue.",
    "Свяжите ветки с PR: один тикет — одна ветка, по возможности маленький diff.",
    "Про Git Flow vs trunk-based — см. урок 3; merge универсален везде.",
  ],
  exercises: [
    {
      type: "scenario",
      id: "git-02-ex-01",
      scenario:
        "`main` ушёл вперёд, пока вы работали в `feature/embeddings`. Тимлид просит линейную историю в PR. Вы ещё не пушили `feature/embeddings` или ею пользуетесь только вы.",
      question:
        "Какой подход к интеграции предпочтёте и какие команды описывают успешный путь?",
      sampleAnswer:
        "Подтянуть актуальный `main`, затем `git switch feature/embeddings` и `git rebase origin/main` (или merge `main` в фичу, если rebase запрещён). Разрешить конфликты по файлам, `git add`, `git rebase --continue`. Force-push ветки фичи только если она уже была запушена — `git push --force-with-lease`, предварительно убедившись, что никто не ответвился от старых SHA.",
      keyPoints: [
        "Rebase до push даёт линейные коммиты; merge сохраняет merge-коммиты.",
        "`--force-with-lease` безопаснее `--force` при обновлении remote-ветки.",
        "Политика команды важнее личных предпочтений.",
      ],
      interviewNote:
        "Показывает понимание последствий переписывания истории и более безопасного force-push.",
    },
    {
      type: "true-false",
      id: "git-02-ex-02",
      statement:
        "Fast-forward merge возможен, когда в целевой ветке появились новые коммиты после создания вашей feature-ветки.",
      correct: false,
      explanation:
        "Fast-forward бывает, когда целевая ветка (например `main`) **не** двигалась относительно базы слияния до конца вливаемой ветки — Git просто двигает указатель. Если в `main` уже есть новые коммиты, обычно нужен merge-коммит или сначала rebase.",
      interviewNote:
        "Проверяют граф слияний, а не только названия команд.",
    },
    {
      type: "multiple-choice",
      id: "git-02-ex-03",
      question:
        "Во время `git rebase` вы исправили конфликт в `README.md`, выполнили `git add README.md`. Что дальше?",
      options: [
        "`git commit -m \"fix conflict\"`",
        "`git rebase --continue`",
        "`git merge --abort`",
        "`git stash pop`",
      ],
      correctIndex: 1,
      explanation:
        "При rebase после индексации исправленных файлов `git rebase --continue` продолжает перенос коммитов. `git merge --abort` относится к merge, не к rebase (для отмены rebase — `git rebase --abort`).",
      interviewNote:
        "Путаница терминов merge и rebase — красный флаг; важна точность.",
    },
    {
      type: "ordering",
      id: "git-02-ex-04",
      question:
        "Упорядочьте шаги разрешения **merge**-конфликта и завершения merge (стандартный поток).",
      items: [
        "`git commit` (завершает merge, если все конфликты сняты)",
        "Отредактировать конфликтующие файлы до финального вида; убрать маркеры",
        "`git status` — посмотреть unmerged пути",
        "`git add` для каждого разрешённого файла",
      ],
      correctOrder: [2, 1, 3, 0],
      explanation:
        "Сначала status, затем правки, индексация, затем commit для финализации merge (или `merge --continue` в соответствующих сценариях).",
      interviewNote:
        "Показывает уверенность в процедуре под давлением — как на парном интервью.",
    },
    {
      type: "code-completion",
      id: "git-02-ex-05",
      question:
        "Допишите команду, чтобы **прервать** текущий rebase и вернуться к состоянию до него.",
      codeTemplate: "git rebase ___",
      language: "bash",
      correctAnswer: "--abort",
      acceptableAnswers: ["--abort"],
      explanation:
        "`git rebase --abort` останавливает rebase и восстанавливает HEAD как до `git rebase`.",
      interviewNote:
        "Знание «аварийных выходов» показывает, что вы отлаживали rebase вживую, а не только читали документацию.",
    },
  ],
};
