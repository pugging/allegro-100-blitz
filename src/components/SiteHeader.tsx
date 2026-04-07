import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

export async function SiteHeader() {
  const supabase = await createServerSupabaseClient();
  const user = supabase
    ? (await supabase.auth.getUser()).data.user
    : null;

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
        >
          <span className="rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow-sm ring-1 ring-[color:var(--secondary-brand)]/35">
            A100
          </span>
          <span className="hidden sm:inline text-sm">Allegro Blitz</span>
        </Link>
        <nav
          className="flex items-center gap-1 sm:gap-3 text-sm"
          aria-label="Основная навигация"
        >
          <Link
            href="/"
            className="rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Наборы
          </Link>
          <Link
            href="/results"
            className="rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Результаты
          </Link>
          {user ? (
            <div className="ml-2 flex items-center gap-2 border-l border-border pl-3">
              <span
                className="hidden max-w-[160px] truncate text-xs text-muted-foreground sm:inline"
                title={user.email ?? ""}
              >
                {user.email}
              </span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className={cn(
                    "rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium",
                    "text-foreground shadow-sm transition-colors",
                    "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                >
                  Выйти
                </button>
              </form>
            </div>
          ) : (
            <div className="ml-2 flex items-center gap-2 border-l border-border pl-3">
              <Link
                href="/auth/login"
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Войти
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Регистрация
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
