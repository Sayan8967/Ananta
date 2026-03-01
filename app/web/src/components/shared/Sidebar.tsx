"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

// =============================================================================
// Sidebar - Reusable responsive sidebar with collapsible mobile drawer
// =============================================================================

export interface SidebarLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  links: SidebarLink[];
  brandLabel: string;
  brandColor?: string;
  children: React.ReactNode;
}

export function Sidebar({
  links,
  brandLabel,
  brandColor = "bg-primary",
  children,
}: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const sidebarWidth = collapsed ? "w-16" : "w-64";

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full border-r bg-card flex flex-col transition-all duration-200",
          sidebarWidth,
          // Mobile: off-screen by default, slide in when open
          "max-lg:-translate-x-full max-lg:w-64",
          mobileOpen && "max-lg:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center",
                  brandColor
                )}
              >
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-semibold text-foreground truncate">
                {brandLabel}
              </span>
            </div>
          )}
          {collapsed && (
            <div
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center mx-auto",
                brandColor
              )}
            >
              <span className="text-white font-bold text-sm">A</span>
            </div>
          )}
          {/* Close button on mobile */}
          <button
            className="lg:hidden p-1 rounded hover:bg-muted"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-hidden">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title={collapsed ? link.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate">{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden lg:flex border-t p-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>

      {/* Main content area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-200",
          // Offset for sidebar on desktop
          collapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        {/* Mobile header with hamburger */}
        <div className="sticky top-0 z-30 lg:hidden flex items-center h-14 border-b bg-background px-4">
          <button
            className="p-2 rounded-lg hover:bg-muted"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-3 flex items-center gap-2">
            <div
              className={cn(
                "h-6 w-6 rounded flex items-center justify-center",
                brandColor
              )}
            >
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="font-semibold text-sm text-foreground">
              {brandLabel}
            </span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
