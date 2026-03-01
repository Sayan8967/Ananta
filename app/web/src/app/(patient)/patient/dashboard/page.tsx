"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import {
  mockPatient,
  mockConditions,
  mockMedications,
  mockAllergies,
  mockTimeline,
} from "@/lib/mock-data";
import { QuickActions } from "@/components/patient/QuickActions";
import { HealthSummaryCards } from "@/components/patient/HealthSummaryCards";
import { TimelineEvent } from "@/components/patient/TimelineEvent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// =============================================================================
// Patient Dashboard - Quick actions, conditions, meds, allergies summary
// =============================================================================

export default function PatientDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const recentTimeline = mockTimeline.slice(0, 4);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Welcome back, {user?.name ?? mockPatient.givenName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here is your health overview for today.
        </p>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Quick Actions
        </h2>
        <QuickActions />
      </section>

      {/* Health Summary */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Health Summary
        </h2>
        <HealthSummaryCards
          conditions={mockConditions}
          medications={mockMedications}
          allergies={mockAllergies}
        />
      </section>

      {/* Recent Activity */}
      <section>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <Link href="/timeline">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {recentTimeline.map((entry, idx) => (
                <TimelineEvent
                  key={entry.id}
                  entry={entry}
                  isLast={idx === recentTimeline.length - 1}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
