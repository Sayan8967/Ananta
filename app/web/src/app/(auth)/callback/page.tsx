"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { useAuthStore } from "@/lib/stores/auth-store";
import { getPrimaryRole } from "@/lib/auth";

// =============================================================================
// OIDC Callback Page - Handles post-login redirect
// =============================================================================

export default function CallbackPage() {
  const router = useRouter();
  const { isInitialized, isAuthenticated } = useAuth();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!isInitialized) return;

    if (isAuthenticated && user) {
      const role = getPrimaryRole(user.roles);
      switch (role) {
        case "doctor":
          router.replace("/doctor/dashboard");
          break;
        case "admin":
          router.replace("/doctor/dashboard");
          break;
        case "patient":
        default:
          router.replace("/patient/dashboard");
          break;
      }
    } else {
      // Not authenticated after init, redirect to login
      router.replace("/login");
    }
  }, [isInitialized, isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1e3a5f] via-[#1a5276] to-[#0d9488]">
      {/* Loading Spinner */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-white/20 border-t-white animate-spin" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">
            Authenticating...
          </h2>
          <p className="text-white/60 text-sm">
            Verifying your credentials and setting up your session
          </p>
        </div>
        <span className="text-3xl font-bold text-white">
          <span className="text-[#5eead4]">&infin;</span> Ananta
        </span>
      </div>
    </div>
  );
}
