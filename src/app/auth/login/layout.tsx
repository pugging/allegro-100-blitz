import { Suspense } from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-16 text-center text-sm text-muted-foreground">
          Загрузка…
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
