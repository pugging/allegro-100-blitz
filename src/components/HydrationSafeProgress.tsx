"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/**
 * Base UI Progress может задавать разметку/стили по-разному на сервере и после гидратации.
 * До mount показываем тот же визуальный прогресс без расхождения SSR/CSR.
 */
export function HydrationSafeProgress({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn("w-full overflow-hidden rounded-full bg-muted", className)}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-primary transition-[width] duration-300"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    );
  }

  return <Progress value={value} className={className} />;
}
