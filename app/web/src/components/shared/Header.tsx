"use client";

import { useAuth } from "@/app/providers";
import { useAuthStore } from "@/lib/stores/auth-store";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// =============================================================================
// Header - Top header with user info, notifications
// =============================================================================

interface HeaderProps {
  profileHref?: string;
}

export function Header({ profileHref = "/profile" }: HeaderProps) {
  const { logout } = useAuth();
  const user = useAuthStore((s) => s.user);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="sticky top-0 z-20 hidden lg:flex items-center h-16 border-b bg-background/80 backdrop-blur-sm px-6">
      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu((v) => !v)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">
                {user ? getInitials(user.name) : <User className="h-4 w-4" />}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-foreground leading-none">
                {user?.name ?? "User"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {user?.email ?? ""}
              </p>
            </div>
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-50 w-48 bg-card border rounded-lg shadow-lg py-1">
                <Link
                  href={profileHref}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  onClick={() => setShowMenu(false)}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    logout();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
