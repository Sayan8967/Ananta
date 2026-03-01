import React from 'react';

export default function EmergencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-red-50">
      {/* Emergency Header */}
      <header className="bg-red-600 text-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">♾️</span>
            <div>
              <h1 className="text-lg font-bold tracking-wide">ANANTA</h1>
              <p className="text-xs text-red-200 font-medium">EMERGENCY ACCESS</p>
            </div>
          </div>
          <span className="text-3xl">🆘</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t border-red-200 bg-red-100/50 mt-auto">
        <div className="max-w-3xl mx-auto px-6 py-4 text-center">
          <p className="text-xs text-red-600">
            This information is provided for emergency medical purposes only.
            Contact local emergency services (112 India / 911 US) for immediate help.
          </p>
        </div>
      </footer>
    </div>
  );
}
