import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// =============================================================================
// StatusBadge - Maps status strings to colored badges
// =============================================================================

const statusColorMap: Record<string, string> = {
  // Clinical statuses
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
  resolved: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
  remission: "bg-indigo-100 text-indigo-800 border-indigo-200",
  recurrence: "bg-orange-100 text-orange-800 border-orange-200",

  // Severity
  severe: "bg-red-100 text-red-800 border-red-200",
  moderate: "bg-amber-100 text-amber-800 border-amber-200",
  mild: "bg-green-100 text-green-800 border-green-200",

  // Criticality
  high: "bg-red-100 text-red-800 border-red-200",
  low: "bg-green-100 text-green-800 border-green-200",
  "unable-to-assess": "bg-gray-100 text-gray-800 border-gray-200",

  // Medication statuses
  "on-hold": "bg-yellow-100 text-yellow-800 border-yellow-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
  stopped: "bg-red-100 text-red-800 border-red-200",

  // Prescription statuses
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  failed: "bg-red-100 text-red-800 border-red-200",

  // Verification
  confirmed: "bg-green-100 text-green-800 border-green-200",
  unconfirmed: "bg-gray-100 text-gray-600 border-gray-200",
  provisional: "bg-yellow-100 text-yellow-800 border-yellow-200",
  differential: "bg-orange-100 text-orange-800 border-orange-200",
  refuted: "bg-red-100 text-red-800 border-red-200",

  // Immunization
  "not-done": "bg-gray-100 text-gray-600 border-gray-200",
  "entered-in-error": "bg-red-100 text-red-800 border-red-200",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorClasses =
    statusColorMap[status] ?? "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <Badge
      variant="outline"
      className={cn(colorClasses, "capitalize", className)}
    >
      {status.replace(/-/g, " ")}
    </Badge>
  );
}
