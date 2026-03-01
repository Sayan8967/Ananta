"use client";

import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { TimelineEntry } from "@/lib/mock-data";
import {
  HeartPulse,
  Pill,
  AlertTriangle,
  Syringe,
  FileText,
} from "lucide-react";

// =============================================================================
// TimelineEvent - Single timeline event component
// =============================================================================

const categoryConfig: Record<
  string,
  { icon: React.ElementType; color: string; bgColor: string; lineColor: string }
> = {
  condition: {
    icon: HeartPulse,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900",
    lineColor: "bg-blue-400",
  },
  medication: {
    icon: Pill,
    color: "text-teal-600",
    bgColor: "bg-teal-100 dark:bg-teal-900",
    lineColor: "bg-teal-400",
  },
  allergy: {
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900",
    lineColor: "bg-red-400",
  },
  immunization: {
    icon: Syringe,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900",
    lineColor: "bg-purple-400",
  },
  prescription: {
    icon: FileText,
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900",
    lineColor: "bg-amber-400",
  },
};

interface TimelineEventProps {
  entry: TimelineEntry;
  isLast?: boolean;
}

export function TimelineEvent({ entry, isLast = false }: TimelineEventProps) {
  const config = categoryConfig[entry.category] ?? categoryConfig.condition;
  const Icon = config.icon;

  return (
    <div className="relative flex gap-4">
      {/* Vertical line */}
      {!isLast && (
        <div
          className={cn(
            "absolute left-[19px] top-10 bottom-0 w-0.5",
            config.lineColor,
            "opacity-30"
          )}
        />
      )}

      {/* Icon */}
      <div
        className={cn(
          "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          config.bgColor
        )}
      >
        <Icon className={cn("h-5 w-5", config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h4 className="text-sm font-semibold text-foreground">
            {entry.title}
          </h4>
          <time className="text-xs text-muted-foreground shrink-0">
            {formatDate(entry.date)}
          </time>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {entry.description}
        </p>
        <span
          className={cn(
            "inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full capitalize",
            config.bgColor,
            config.color
          )}
        >
          {entry.category}
        </span>
      </div>
    </div>
  );
}
