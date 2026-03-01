"use client";

import { useAuth } from "@/app/providers";
import { LogIn, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// =============================================================================
// Login Page - Ananta-branded sign-in with Keycloak OIDC
// =============================================================================

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1e3a5f] via-[#1a5276] to-[#0d9488] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-4xl font-bold text-white">
              <span className="text-[#5eead4]">&infin;</span> Ananta
            </span>
          </Link>
          <p className="text-white/60 mt-2 text-sm">
            Infinite Care, Infinite Memory
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-2">
              Sign in to access your health dashboard
            </p>
          </div>

          {/* Sign In Button */}
          <Button
            onClick={login}
            className="w-full h-12 text-base font-semibold bg-[#1e3a5f] hover:bg-[#162b47] text-white rounded-xl"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Sign in with Ananta ID
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-400">or</span>
            </div>
          </div>

          {/* Emergency Access */}
          <Link
            href="/emergency"
            className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border-2 border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors"
          >
            <Shield className="h-5 w-5" />
            Emergency Access
          </Link>

          {/* Info */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Secured with Keycloak OIDC. Your data is encrypted and compliant
            with healthcare data protection standards.
          </p>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
