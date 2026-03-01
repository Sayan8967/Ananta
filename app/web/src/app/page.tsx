import Link from "next/link";
import {
  Shield,
  Brain,
  Heart,
  ArrowRight,
  Activity,
  Users,
  Lock,
} from "lucide-react";

// =============================================================================
// Landing Page - Beautiful hero with gradient and value props
// =============================================================================

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#1e3a5f]">
                <span className="text-[#0d9488]">&infin;</span> Ananta
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm text-gray-600 hover:text-[#1e3a5f] transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-sm text-gray-600 hover:text-[#1e3a5f] transition-colors"
              >
                About
              </a>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#162b47] transition-colors"
              >
                Sign In
              </Link>
            </div>
            <Link
              href="/login"
              className="md:hidden inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e3a5f] text-white text-sm font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#1a5276] to-[#0d9488]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2em0wIDEyYzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo */}
          <div className="mb-8">
            <span className="text-6xl sm:text-7xl font-bold text-white">
              <span className="text-[#5eead4]">&infin;</span> Ananta
            </span>
          </div>

          {/* Tagline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Infinite Care, Infinite Memory
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-white/80 mb-10 leading-relaxed">
            A comprehensive healthcare platform connecting patients, providers,
            and emergency services with lifelong health records built on FHIR
            standards and powered by AI.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#1e3a5f] font-semibold text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/emergency"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 text-white font-medium text-lg hover:bg-white/10 transition-all"
            >
              <Shield className="h-5 w-5" />
              Emergency Access
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-white">
                FHIR
              </div>
              <div className="text-sm text-white/60 mt-1">R4 Standard</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-white">
                AI
              </div>
              <div className="text-sm text-white/60 mt-1">
                Powered Insights
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-white">
                24/7
              </div>
              <div className="text-sm text-white/60 mt-1">
                Emergency Ready
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1e3a5f] mb-4">
              Why Choose Ananta?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built for the future of healthcare with standards-based
              interoperability and intelligent automation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#1e3a5f]/10 mb-6">
                <Heart className="h-7 w-7 text-[#1e3a5f]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Lifelong Records
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your complete health history in one place. From conditions and
                medications to immunizations and allergies, all structured using
                FHIR R4 standards for seamless portability.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0d9488]/10 mb-6">
                <Brain className="h-7 w-7 text-[#0d9488]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI-Powered Insights
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Upload prescriptions and let AI extract medication details
                automatically. Get intelligent health insights and timeline
                views of your medical journey.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10 mb-6">
                <Shield className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Emergency Ready
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Generate emergency access cards with critical health info.
                First responders can instantly access allergies, medications, and
                emergency contacts via a secure access code.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section id="about" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1e3a5f] mb-4">
              Three Portals, One Platform
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mx-auto mb-4">
                <Users className="h-8 w-8 text-[#1e3a5f]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Patient Portal</h3>
              <p className="text-gray-600 text-sm">
                Manage your health records, view timelines, upload
                prescriptions, and control data sharing with consent management.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 mx-auto mb-4">
                <Activity className="h-8 w-8 text-[#0d9488]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Provider Portal</h3>
              <p className="text-gray-600 text-sm">
                Search patients, view comprehensive records, add clinical notes,
                and manage treatment plans efficiently.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mx-auto mb-4">
                <Lock className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Emergency Access</h3>
              <p className="text-gray-600 text-sm">
                Instant access to critical patient information via secure codes.
                No login required for time-sensitive emergencies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e3a5f] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">
                <span className="text-[#5eead4]">&infin;</span> Ananta
              </span>
              <span className="text-white/50 text-sm ml-4">
                Infinite Care, Infinite Memory
              </span>
            </div>
            <div className="text-sm text-white/50">
              Built with FHIR R4 standards. Securing health data with care.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
