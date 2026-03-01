import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Ananta - Infinite Care, Infinite Memory",
    template: "%s | Ananta",
  },
  description:
    "Ananta is a comprehensive healthcare platform providing seamless care coordination between patients, doctors, and emergency services. Built on FHIR standards for interoperability and powered by AI for intelligent health insights.",
  keywords: [
    "healthcare",
    "medical",
    "patient portal",
    "doctor",
    "emergency",
    "FHIR",
    "health records",
    "telemedicine",
  ],
  authors: [{ name: "Ananta Health" }],
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1e3a5f" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1a2f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
