"use client";

import { useState, useMemo } from "react";
import { mockTimeline } from "@/lib/mock-data";
import { TimelineEvent } from "@/components/patient/TimelineEvent";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Search } from "lucide-react";

// =============================================================================
// Health Timeline Page - Vertical timeline UI with filters
// =============================================================================

const categories = [
  "all",
  "condition",
  "medication",
  "allergy",
  "immunization",
  "prescription",
] as const;

export default function TimelinePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    let entries = [...mockTimeline];

    if (category !== "all") {
      entries = entries.filter((e) => e.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      entries = entries.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }

    return entries;
  }, [search, category]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Health Timeline</h1>
        <p className="text-muted-foreground mt-1">
          A chronological view of your complete health journey.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="sm:w-48"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </Select>
      </div>

      {/* Timeline */}
      <div className="pt-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No timeline events match your filters.</p>
          </div>
        ) : (
          <div>
            {filtered.map((entry, idx) => (
              <TimelineEvent
                key={entry.id}
                entry={entry}
                isLast={idx === filtered.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
