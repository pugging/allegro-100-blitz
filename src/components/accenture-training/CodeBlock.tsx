"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  language: string;
  code: string;
  filename?: string;
  className?: string;
}

const LANG_COLORS: Record<string, string> = {
  python: "bg-blue-500/15 text-blue-600",
  typescript: "bg-blue-400/15 text-blue-500",
  javascript: "bg-yellow-500/15 text-yellow-600",
  bash: "bg-gray-500/15 text-gray-600",
  json: "bg-green-500/15 text-green-600",
  yaml: "bg-purple-500/15 text-purple-600",
  sql: "bg-orange-500/15 text-orange-600",
  http: "bg-indigo-500/15 text-indigo-600",
};

export function CodeBlock({ language, code, filename, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const langColor = LANG_COLORS[language] ?? "bg-muted text-muted-foreground";

  function handleCopy() {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/60 bg-[#1e1e2e] text-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase",
              langColor,
            )}
          >
            {language}
          </span>
          {filename && (
            <span className="text-xs text-gray-400">{filename}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="rounded-md px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-200"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-gray-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}
