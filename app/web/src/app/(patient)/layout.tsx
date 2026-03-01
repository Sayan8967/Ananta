"use client";

import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";
import {
  LayoutDashboard,
  FileText,
  Clock,
  Camera,
  Shield,
  User,
} from "lucide-react";
import type { SidebarLink } from "@/components/shared/Sidebar";

// =============================================================================
// Patient Layout - Sidebar nav (responsive, collapsible on mobile)
// =============================================================================

const patientLinks: SidebarLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/records", label: "Health Records", icon: FileText },
  { href: "/timeline", label: "Timeline", icon: Clock },
  { href: "/prescriptions", label: "Prescriptions", icon: Camera },
  { href: "/emergency-card", label: "Emergency Card", icon: Shield },
  { href: "/profile", label: "Profile", icon: User },
];

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sidebar links={patientLinks} brandLabel="Patient Portal">
      <Header profileHref="/profile" />
      {children}
    </Sidebar>
  );
}
