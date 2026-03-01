import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and merges Tailwind CSS classes
 * to avoid conflicts. This is the standard shadcn/ui utility.
 *
 * @example
 * cn("px-4 py-2", "px-6") // -> "px-6 py-2"
 * cn("text-red-500", condition && "text-blue-500") // conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date for display in the application.
 * Returns a human-readable date string.
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

/**
 * Formats a date with time for display.
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Extracts initials from a full name string.
 *
 * @example
 * getInitials("John Doe") // -> "JD"
 * getInitials("Alice") // -> "A"
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncates a string to the specified length with ellipsis.
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
