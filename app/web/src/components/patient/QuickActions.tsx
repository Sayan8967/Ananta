"use client";

import Link from "next/link";
import {
  FileText,
  Clock,
  Camera,
  Shield,
  User,
  Activity,
} from "lucide-react";

// =============================================================================
// QuickActions - Quick action grid for patient dashboard
// =============================================================================

const actions = [
  {
    label: "Health Records",
    description: "View conditions, meds & more",
    href: "/records",
    icon: FileText,
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  },
  {
    label: "Timeline",
    description: "Your health journey",
    href: "/timeline",
    icon: Clock,
    color: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400",
  },
  {
    label: "Scan Prescription",
    description: "Upload or photograph",
    href: "/prescriptions",
    icon: Camera,
    color: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  },
  {
    label: "Emergency Card",
    description: "Generate & share",
    href: "/emergency-card",
    icon: Shield,
    color: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
  },
  {
    label: "Profile",
    description: "Personal info & settings",
    href: "/profile",
    icon: User,
    color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  },
  {
    label: "Activity",
    description: "Recent health events",
    href: "/timeline",
    icon: Activity,
    color: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.label}
            href={action.href}
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border bg-card hover:shadow-md transition-all text-center"
          >
            <div
              className={`h-12 w-12 rounded-xl flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {action.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                {action.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
