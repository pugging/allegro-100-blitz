"use client";

import { cn } from "@/lib/utils";
import { CodeBlock } from "./CodeBlock";
import type { ContentBlock } from "@/lib/accenture-training/types";

interface LessonViewerProps {
  content: ContentBlock[];
}

export function LessonViewer({ content }: LessonViewerProps) {
  return (
    <div className="space-y-5">
      {content.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </div>
  );
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "text":
      return (
        <p className="text-sm leading-relaxed text-foreground/90">
          {block.content}
        </p>
      );

    case "heading": {
      const Tag = `h${block.level}` as "h2" | "h3" | "h4";
      const sizes = {
        2: "text-xl font-semibold mt-8 mb-3",
        3: "text-lg font-semibold mt-6 mb-2",
        4: "text-base font-medium mt-4 mb-1",
      };
      return (
        <Tag className={cn("tracking-tight text-foreground", sizes[block.level])}>
          {block.content}
        </Tag>
      );
    }

    case "code":
      return (
        <CodeBlock
          language={block.language}
          code={block.code}
          filename={block.filename}
        />
      );

    case "callout": {
      const variants = {
        info: "border-blue-300/30 bg-blue-50/50 text-blue-900",
        warning: "border-amber-300/30 bg-amber-50/50 text-amber-900",
        success: "border-green-300/30 bg-green-50/50 text-green-900",
        danger: "border-red-300/30 bg-red-50/50 text-red-900",
      };
      const icons = {
        info: "\u2139\uFE0F",
        warning: "\u26A0\uFE0F",
        success: "\u2705",
        danger: "\u274C",
      };
      return (
        <div
          className={cn(
            "rounded-xl border p-4 text-sm leading-relaxed",
            variants[block.variant],
          )}
        >
          {block.title && (
            <p className="mb-1 font-semibold">
              {icons[block.variant]} {block.title}
            </p>
          )}
          <p>{block.content}</p>
        </div>
      );
    }

    case "tip":
      return (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed">
          <span className="font-semibold text-primary">Pro tip: </span>
          {block.content}
        </div>
      );

    case "list":
      return block.ordered ? (
        <ol className="space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 list-decimal">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul className="space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 list-disc">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );

    case "diagram":
      return (
        <div className="overflow-x-auto rounded-xl border border-border/60 bg-muted/30 p-4">
          <pre className="text-xs leading-relaxed text-muted-foreground whitespace-pre font-mono">
            {block.content}
          </pre>
          {block.alt && (
            <p className="mt-2 text-xs italic text-muted-foreground">
              {block.alt}
            </p>
          )}
        </div>
      );

    default:
      return null;
  }
}
