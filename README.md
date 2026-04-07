# Allegro 100 Blitz

Подготовка к интервью Allegro e-Xperience: **100 блиц-наборов**, **900 вопросов**. Next.js (App Router), Tailwind, shadcn/ui, **Supabase Auth** и синхронизация прогресса в облаке.

## Локально

```bash
cp .env.example .env.local
# Укажите NEXT_PUBLIC_SUPABASE_* или оставьте пустым — только localStorage

npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

---

## Supabase (сначала база и Auth)

1. [supabase.com](https://supabase.com) → **New project** (запомните пароль БД).
2. **SQL Editor** → New query → вставьте файл  
   [`supabase/migrations/20260407120000_user_progress.sql`](supabase/migrations/20260407120000_user_progress.sql) → **Run**.
3. **Authentication → Providers → Email** — включите **Email**. Для быстрых тестов можно отключить **Confirm email**.
4. **Project Settings → API** — скопируйте:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   (это **не** секрет сервера: ключ с RLS, только публичные операции с вашими политиками.)
5. **Authentication → URL configuration** (обновите после первого деплоя Vercel):
   - **Site URL**: `https://ВАШ-ПРОЕКТ.vercel.app`
   - **Redirect URLs** (по одному на строку или через запятую в UI):
     - `http://localhost:3000/auth/callback`
     - `https://ВАШ-ПРОЕКТ.vercel.app/auth/callback`

---

## Vercel (деплой)

### Вариант A: через сайт

1. Зайдите на [vercel.com](https://vercel.com) → **Add New… → Project**.
2. **Import** ваш GitHub-репозиторий с этим кодом.
3. Если репозиторий содержит только папку `allegro-blitz` как корень — оставьте **Root Directory** пустым.  
   Если репозиторий — монorepo и приложение в подпапке: **Root Directory** = `allegro-blitz`.
4. **Environment Variables** (Production; при необходимости Preview):
   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | из Supabase API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | из Supabase API |
   | `NEXT_PUBLIC_SITE_URL` | `https://ВАШ-ПРОЕКТ.vercel.app` (точный URL после деплоя) |
5. **Deploy**. После успешного деплоя скопируйте **Production URL** и вставьте в Supabase **Site URL** и **Redirect URLs**, затем сохраните в Supabase.

### Вариант B: через CLI

```bash
cd allegro-blitz
npx vercel login
npx vercel        # первый раз: согласиться с настройками, привязать к аккаунту
npx vercel env pull   # опционально: вытянуть env локально
```

Переменные окружения удобнее задать в Vercel → Project → **Settings → Environment Variables**, затем **Redeploy**.

---

## Связка Vercel ↔ Supabase

- В Vercel должны стоять **те же** `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY`, что в Supabase Dashboard.
- `NEXT_PUBLIC_SITE_URL` должен совпадать с реальным доменом продакшена (иначе редирект после подтверждения email может увести не туда).
- После смены домена — обновите **Redirect URLs** в Supabase.

Без переменных Supabase приложение **собирается** и работает в гостевом режиме (только `localStorage`).

---

## Дизайн

Ориентир: [premium typeui](https://typeui.sh) — Inter, JetBrains Mono, токены primary / secondary-brand / success / warning / danger, светлая тема, отступы кратны 4/8/12/16/24/32, на блице — лимит **90 с** на вопрос (как ориентир под SkillPanel).

## Ссылки

- [Next.js](https://nextjs.org/docs)
- [Supabase Auth + Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
