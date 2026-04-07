"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { mergeUserProgress } from "@/lib/merge-progress";
import { recomputeProgressFromBlitzes } from "@/lib/recompute-progress";
import {
  loadProgressFromStorage,
  saveProgress,
  saveBlitzResult as storageSaveBlitz,
  resetProgress as storageReset,
} from "@/lib/storage";
import { saveCloudProgress, resetCloudProgress } from "@/app/actions/progress";
import type { BlitzResult, UserProgress } from "@/lib/types";

type ProgressContextValue = {
  progress: UserProgress;
  hydrated: boolean;
  isSignedIn: boolean;
  persistBlitzResult: (
    result: BlitzResult,
    topicAnswers: { topic: string; correct: boolean }[],
  ) => Promise<void>;
  resetAll: () => Promise<void>;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function useProgressContext(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgressContext must be used within ProgressProvider");
  }
  return ctx;
}

export function ProgressProvider({
  children,
  isSignedIn,
  initialCloudProgress,
}: {
  children: React.ReactNode;
  isSignedIn: boolean;
  initialCloudProgress: UserProgress | null;
}) {
  const [progress, setProgress] = useState<UserProgress>(() =>
    recomputeProgressFromBlitzes({}),
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const local = loadProgressFromStorage();
    const remote =
      initialCloudProgress ?? recomputeProgressFromBlitzes({});
    const merged = mergeUserProgress(local, remote);
    setProgress(merged);
    saveProgress(merged);
    if (isSignedIn) {
      void saveCloudProgress(merged);
    }
    setHydrated(true);
    // Intentionally once on mount; вход через redirect перезагружает страницу.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistBlitzResult = useCallback(
    async (
      result: BlitzResult,
      topicAnswers: { topic: string; correct: boolean }[],
    ) => {
      const next = storageSaveBlitz(result, topicAnswers);
      setProgress(next);
      if (isSignedIn) {
        const r = await saveCloudProgress(next);
        if (!r.ok) {
          console.warn("Cloud sync failed:", r.error);
        }
      }
    },
    [isSignedIn],
  );

  const resetAll = useCallback(async () => {
    storageReset();
    const empty = recomputeProgressFromBlitzes({});
    setProgress(empty);
    if (isSignedIn) {
      await resetCloudProgress();
    }
  }, [isSignedIn]);

  const value = useMemo(
    () => ({
      progress,
      hydrated,
      isSignedIn,
      persistBlitzResult,
      resetAll,
    }),
    [progress, hydrated, isSignedIn, persistBlitzResult, resetAll],
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}
